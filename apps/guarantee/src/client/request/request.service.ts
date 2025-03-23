import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import {
  BPMNPROCESS,
  GSAssignedGuarantee,
  GSGuarantee,
  GSRequest,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { NormalRequestDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Transaction, Op } from 'sequelize';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import { BPMNRequestService } from '@rahino/bpmn/modules/request/request.service';
import { GuaranteeProcessEnum } from '@rahino/guarantee/shared/process';
import { GSRequestCategoryEnum } from '@rahino/guarantee/shared/request-category';
import { AddressService } from '../address/address.service';
import { InjectQueue } from '@nestjs/bullmq';
import { NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/normal-guarantee-request-sms-sender/constants';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(GSRequest) private repository: typeof GSRequest,
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    private readonly addressService: AddressService,
    private readonly localizationService: LocalizationService,
    private readonly bpmnRequestService: BPMNRequestService,
    @InjectModel(BPMNPROCESS)
    private readonly processRepository: typeof BPMNPROCESS,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectQueue(NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE)
    private readonly normalGuaranteeRequestSmsSenderQueue,
  ) {}

  async createNormalGuaranteeRequest(user: User, dto: NormalRequestDto) {
    const asssignedGuarantee = await this.assignedGuaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSGuarantee,
            as: 'guarantee',
            required: true,
            where: {
              guaranteeTypeId: GSGuaranteeTypeEnum.Normal,
            },
          },
        ])
        .filter({ userId: user.id })
        .filter({ guaranteeId: dto.guaranteeId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAssignedGuarantee.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!asssignedGuarantee) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    if (asssignedGuarantee.guarantee.endDate <= new Date()) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.expire_date_of_card_is_reach',
        ),
      );
    }

    const process = await this.processRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          staticId: GuaranteeProcessEnum.MainProcessId,
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNPROCESS.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!process) {
      throw new InternalServerErrorException([
        this.localizationService.translate('bpmn.process'),
        ' ',
        this.localizationService.translate('core.not_found'),
      ]);
    }

    // thats return error of not exists address
    await this.addressService.findById(user, dto.addressId);
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    let requestId: bigint;
    try {
      const bpmnRequest = await this.bpmnRequestService.initRequest(
        {
          userId: user.id,
          description: dto.description,
          processId: process.id,
        },
        transaction,
      );
      await this.repository.create(
        {
          id: bpmnRequest.id,
          requestTypeId: dto.requestTypeId,
          requestCategoryId: GSRequestCategoryEnum.NormalGuarantee,
          userId: user.id,
          brandId: asssignedGuarantee.guarantee.brandId,
          variantId: asssignedGuarantee.guarantee.variantId,
          productTypeId: asssignedGuarantee.guarantee.productTypeId,
          addressId: dto.addressId,
          phoneNumber: dto.phoneNumber,
          guaranteeId: asssignedGuarantee.guaranteeId,
        },
        { transaction: transaction },
      );
      requestId = bpmnRequest.id;
      await transaction.commit();
      await this.normalGuaranteeRequestSmsSenderQueue.add(
        'normal_guarantee_request_sms_sender',
        {
          phoneNumber: user.phoneNumber,
        },
      );
    } catch (error) {
      await transaction.rollback();
    }
    return {
      result: {
        trackingCode: requestId,
        message: this.localizationService.translate('core.success'),
      },
    };
  }
}
