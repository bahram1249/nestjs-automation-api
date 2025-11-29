import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GSAssignedGuarantee,
  GSBrand,
  GSGuarantee,
  GSGuaranteePeriod,
  GSProductType,
  GSVariant,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { NormalGuaranteeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as _ from 'lodash';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/shared/guarantee-confirm-status';
import { InjectQueue } from '@nestjs/bullmq';
import { CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-submit-card-sms-sender/constants';
import { Queue } from 'bullmq';
@Injectable()
export class NormalGuaranteeService {
  constructor(
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectQueue(CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE)
    private readonly clientSubmitCardSmsSenderQueue: Queue,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          model: GSGuarantee,
          as: 'guarantee',
          required: true,
          attributes: [
            'id',
            'serialNumber',
            'startDate',
            'endDate',
            'variantId',
            'brandId',
            'productTypeId',
          ],
          include: [
            { model: GSProductType, as: 'productType', required: false },
            { model: GSVariant, as: 'variant', required: false },
            { model: GSBrand, as: 'brand', required: false },
            {
              model: GSGuaranteePeriod,
              as: 'guaranteePeriod',
              required: false,
            },
          ],
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.Normal },
              {
                serialNumber: {
                  [Op.like]: filter.search,
                },
              },
            ],
          },
        },
      ])
      .filter({ userId: user.id })
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
      );

    const count = await this.assignedGuaranteeRepository.count(query.build());
    query = query.offset(filter.offset).limit(filter.limit);
    const assignedGuarantees = await this.assignedGuaranteeRepository.findAll(
      query.build(),
    );
    const result = assignedGuarantees.map(
      (assignedGuarantee) => assignedGuarantee.guarantee,
    );
    return {
      result: result,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const query = new QueryOptionsBuilder()
      .include([
        {
          model: GSGuarantee,
          as: 'guarantee',
          required: true,
          attributes: [
            'id',
            'serialNumber',
            'startDate',
            'endDate',
            'variantId',
            'brandId',
            'productTypeId',
          ],
          include: [
            { model: GSProductType, as: 'productType', required: false },
            { model: GSVariant, as: 'variant', required: false },
            { model: GSBrand, as: 'brand', required: false },
            {
              model: GSGuaranteePeriod,
              as: 'guaranteePeriod',
              required: false,
            },
          ],
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.Normal },
              {
                id: entityId,
              },
            ],
          },
        },
      ])
      .filter({ userId: user.id })
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
      );

    const assignedGuarantee = await this.assignedGuaranteeRepository.findOne(
      query.build(),
    );

    if (!assignedGuarantee) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return {
      result: assignedGuarantee.guarantee,
    };
  }

  async create(user: User, dto: NormalGuaranteeDto) {
    const guarantee = await this.checkGuaranteeIsValidThenReturnGuarantee(
      dto.serialNumber,
      user,
    );

    await this.assignedGuaranteeRepository.create({
      guaranteeId: guarantee.id,
      userId: user.id,
    });

    await this.clientSubmitCardSmsSenderQueue.add(
      'send-client-submit-card-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
        serialNumber: guarantee.serialNumber,
      },
    );

    return {
      result: guarantee,
    };
  }

  async getAvailability(user: User, serialNumber: string) {
    const result = await this.checkGuaranteeIsValidThenReturnGuarantee(
      serialNumber,
      user,
    );
    return { result };
  }

  private async checkGuaranteeIsValidThenReturnGuarantee(
    serialNumber: string,
    user: User,
  ): Promise<GSGuarantee> {
    const guarantee = await this.guaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'serialNumber',
          'startDate',
          'endDate',
          'variantId',
          'brandId',
          'productTypeId',
        ])
        .include([
          { model: GSProductType, as: 'productType', required: false },
          { model: GSVariant, as: 'variant', required: false },
          { model: GSBrand, as: 'brand', required: false },
          { model: GSGuaranteePeriod, as: 'guaranteePeriod', required: false },
        ])
        .filter({ serialNumber: serialNumber })
        .filter({ guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm })
        .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.Normal })
        .build(),
    );

    if (!guarantee) {
      throw new NotFoundException(
        this.i18n.t('guarantee.details_of_requested_card_is_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const currentDate = new Date();
    if (guarantee.endDate < currentDate) {
      throw new NotFoundException(
        this.i18n.t('guarantee.expire_date_of_card_is_reach', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const query = new QueryOptionsBuilder()
      .include([
        {
          model: GSGuarantee,
          as: 'guarantee',
          required: true,
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.Normal },
              { serialNumber: serialNumber },
            ],
          },
        },
      ])
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
      );

    const assignedGuarantee = await this.assignedGuaranteeRepository.findOne(
      query.build(),
    );

    if (assignedGuarantee != null && assignedGuarantee.userId != user.id) {
      throw new BadRequestException(
        this.i18n.t(
          'guarantee.this_card_assigned_to_another_user_call_support_user',
          {
            lang: I18nContext.current().lang,
          },
        ),
      );
    }

    if (assignedGuarantee) {
      throw new BadRequestException(
        this.i18n.t('guarantee.you_entered_this_card_before', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return guarantee;
  }
}
