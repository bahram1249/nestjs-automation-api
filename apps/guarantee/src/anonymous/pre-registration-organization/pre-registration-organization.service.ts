import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GSPreRegistrationOrganization } from '@rahino/localdatabase/models';
import { PreRegistrationOrganizationDto } from './dto';
import { Sequelize, Transaction } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { AddressService } from '@rahino/guarantee/client/address/address.service';
import { Attachment } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSAttachmentTypeEnum } from '@rahino/guarantee/shared/gs-attachment-type';
import { Op } from 'sequelize';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PRE_REGISTRATION_INIT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/pre-registration-init-sms-sender/constants';
@Injectable()
@Injectable()
export class PreRegistrationOrganizationService {
  constructor(
    @InjectModel(GSPreRegistrationOrganization)
    private readonly repository: typeof GSPreRegistrationOrganization,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,

    private readonly localizationService: LocalizationService,
    private readonly addressService: AddressService,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,

    @InjectQueue(PRE_REGISTRATION_INIT_SMS_SENDER_QUEUE)
    private readonly preRegistrationInitSmsSenderQueue: Queue,
  ) {}

  async create(dto: PreRegistrationOrganizationDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let preRegistrationOrganization: GSPreRegistrationOrganization;

    const licenseAttachment = await this.findTempAttachment(
      dto.licenseAttachmentId,
    );

    const postalAttachment = await this.findTempAttachment(
      dto.postalAttachmentId,
    );
    const estateAttachment = await this.findTempAttachment(
      dto.estateAttachmentId,
    );
    const nationalAttachment = await this.findTempAttachment(
      dto.nationalAttachmentId,
    );

    if (
      !licenseAttachment ||
      !postalAttachment ||
      !estateAttachment ||
      !nationalAttachment
    ) {
      throw new BadRequestException(
        this.localizationService.translate('core.dont_access_to_this_file'),
      );
    }

    try {
      if (!dto.address.postalCode) {
        throw new BadRequestException(
          this.localizationService.translate('guarantee.address_postalcode'),
        );
      }

      const address = await this.addressService.create(
        dto.address,
        null,
        transaction,
      );

      preRegistrationOrganization = this.mapper.map(
        dto,
        PreRegistrationOrganizationDto,
        GSPreRegistrationOrganization,
      );
      preRegistrationOrganization.firstname = dto.user.firstname;
      preRegistrationOrganization.lastname = dto.user.lastname;
      preRegistrationOrganization.phoneNumber = dto.user.phoneNumber;
      preRegistrationOrganization.addressId = address.result.id;
      preRegistrationOrganization.postalCode = address.result.postalCode;
      preRegistrationOrganization.licenseCode = dto.licenseCode;

      licenseAttachment.attachmentTypeId = GSAttachmentTypeEnum.License;
      licenseAttachment.save({ transaction: transaction });

      postalAttachment.attachmentTypeId = GSAttachmentTypeEnum.Postal;
      postalAttachment.save({ transaction: transaction });

      estateAttachment.attachmentTypeId = GSAttachmentTypeEnum.Estate;
      estateAttachment.save({ transaction: transaction });

      nationalAttachment.attachmentTypeId = GSAttachmentTypeEnum.National;
      nationalAttachment.save({ transaction: transaction });

      preRegistrationOrganization.licenseAttachmentId = licenseAttachment.id;
      preRegistrationOrganization.estateAttachmentId = estateAttachment.id;
      preRegistrationOrganization.postalAttachmentId = postalAttachment.id;
      preRegistrationOrganization.nationalAttachmentId = nationalAttachment.id;

      // create pre registration organization
      preRegistrationOrganization = await this.repository.create(
        _.omit(preRegistrationOrganization.toJSON(), ['id']),
        { transaction: transaction },
      );

      await this.preRegistrationInitSmsSenderQueue.add(
        'PRE_REGISTRATION_INIT_SMS_SENDER',
        {
          firstname: preRegistrationOrganization.firstname,
          lastname: preRegistrationOrganization.lastname,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: {
        id: preRegistrationOrganization.id,
        message: this.localizationService.translate('core.success'),
      },
    };
  }

  private async findTempAttachment(attachmentId: bigint): Promise<Attachment> {
    return await this.attachmentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: attachmentId })
        .filter({ attachmentTypeId: GSAttachmentTypeEnum.TempOrganization })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Attachment.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
  }
}
