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
  ) {}

  async create(dto: PreRegistrationOrganizationDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let preRegistartionOrganization: GSPreRegistrationOrganization;

    let licenseAttachment = await this.findTempAttachment(
      dto.licenseAttachmentId,
    );

    let postalAttachment = await this.findTempAttachment(
      dto.postalAttachmentId,
    );
    let estateAttachment = await this.findTempAttachment(
      dto.estateAttachmentId,
    );
    let nationalAttachment = await this.findTempAttachment(
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

      const preRegistrationOrganization = this.mapper.map(
        dto,
        PreRegistrationOrganizationDto,
        GSPreRegistrationOrganization,
      );
      preRegistrationOrganization.firstname = dto.user.firstname;
      preRegistrationOrganization.lastname = dto.user.lastname;
      preRegistrationOrganization.phoneNumber = dto.user.phoneNumber;
      preRegistrationOrganization.addressId = address.result.id;
      preRegistartionOrganization.postalCode = address.result.postalCode;

      licenseAttachment.attachmentTypeId = GSAttachmentTypeEnum.License;
      licenseAttachment.save({ transaction: transaction });

      postalAttachment.attachmentTypeId = GSAttachmentTypeEnum.Postal;
      postalAttachment.save({ transaction: transaction });

      estateAttachment.attachmentTypeId = GSAttachmentTypeEnum.Estate;
      estateAttachment.save({ transaction: transaction });

      nationalAttachment.attachmentTypeId = GSAttachmentTypeEnum.National;
      nationalAttachment.save({ transaction: transaction });

      preRegistartionOrganization.licenseAttachmentId = licenseAttachment.id;
      preRegistartionOrganization.estateAttachmentId = estateAttachment.id;
      preRegistartionOrganization.postalAttachmentId = postalAttachment.id;
      preRegistartionOrganization.nationalAttachmentId = nationalAttachment.id;

      // create pre registration organization
      preRegistartionOrganization = await this.repository.create(
        _.omit(preRegistartionOrganization, ['id']),
        { transaction: transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: {
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
