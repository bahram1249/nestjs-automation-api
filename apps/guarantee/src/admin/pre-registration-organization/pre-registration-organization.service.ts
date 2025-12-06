import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfirmDto, DeleteDto, GetPreRegistrationOrganization } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSAddress,
  GSCity,
  GSNeighborhood,
  GSPreRegistrationOrganization,
  GSProvince,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, where } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { Attachment } from '@rahino/database';
import { GuaranteeOrganizationService } from '../guarantee-organization';
import { GuaranteeOrganizationContractService } from '../guarantee-organization-contract';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AddressDto } from '@rahino/guarantee/client/address/dto';
import { InjectQueue } from '@nestjs/bullmq';
import { PRE_REGISTRATION_SUCESS_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/pre-registration-sucess-sms-sender/constants';
import { Queue } from 'bullmq';
import { PRE_REGISTRATION_REJECT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/pre-registration-reject-description-sms-sender/constants';
@Injectable()
export class PreRegistrationOrganizationService {
  constructor(
    @InjectModel(GSPreRegistrationOrganization)
    private readonly repository: typeof GSPreRegistrationOrganization,
    private readonly guaranteeOrganizationService: GuaranteeOrganizationService,
    private readonly guaranteeOrganizationContractService: GuaranteeOrganizationContractService,
    private readonly localizationService: LocalizationService,
    @InjectMapper()
    private readonly mapper: Mapper,

    @InjectQueue(PRE_REGISTRATION_SUCESS_SMS_SENDER_QUEUE)
    private readonly preRegistrationSucessSmsSenderQueue: Queue,
    @InjectQueue(PRE_REGISTRATION_REJECT_SMS_SENDER_QUEUE)
    private readonly preRegistrationRejectDescriptionSmsSenderQueue: Queue,
  ) {}

  async findAll(filter: GetPreRegistrationOrganization) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSPreRegistrationOrganization.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'title',
        'licenseDate',
        'licenseAttachmentId',
        'estateAttachmentId',
        'postalAttachmentId',
        'nationalAttachmentId',
        'addressId',
        'firstname',
        'lastname',
        'phoneNumber',
        'isConfirm',
        'confirmDate',
        'createdAt',
        'updatedAt',
        'licenseCode',
      ])
      .include([
        {
          model: GSAddress,
          as: 'address',
          required: true,
          include: [
            {
              attributes: ['id', 'name'],
              model: GSProvince,
              as: 'province',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: GSCity,
              as: 'city',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: GSNeighborhood,
              as: 'neighborhood',
              required: false,
            },
          ],
        },
      ])
      .thenInclude({
        model: Attachment,
        as: 'licenseAttachment',
        attributes: ['id', 'fileName'],
      })
      .thenInclude({
        model: Attachment,
        as: 'nationalAttachment',
        attributes: ['id', 'fileName'],
      })
      .thenInclude({
        model: Attachment,
        as: 'estateAttachment',
        attributes: ['id', 'fileName'],
      })
      .thenInclude({
        model: Attachment,
        as: 'postalAttachment',
        attributes: ['id', 'fileName'],
      })
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'licenseDate',
          'licenseAttachmentId',
          'estateAttachmentId',
          'postalAttachmentId',
          'nationalAttachmentId',
          'addressId',
          'firstname',
          'lastname',
          'phoneNumber',
          'isCofirm',
          'confirmDate',
          'licenseCode',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            model: GSAddress,
            as: 'address',
            required: true,
            include: [
              {
                attributes: ['id', 'name'],
                model: GSProvince,
                as: 'province',
                required: false,
              },
              {
                attributes: ['id', 'name'],
                model: GSCity,
                as: 'city',
                required: false,
              },
              {
                attributes: ['id', 'name'],
                model: GSNeighborhood,
                as: 'neighborhood',
                required: false,
              },
            ],
          },
        ])
        .thenInclude({
          model: Attachment,
          as: 'licenseAttachment',
          attributes: ['id', 'fileName'],
        })
        .thenInclude({
          model: Attachment,
          as: 'nationalAttachment',
          attributes: ['id', 'fileName'],
        })
        .thenInclude({
          model: Attachment,
          as: 'estateAttachment',
          attributes: ['id', 'fileName'],
        })
        .thenInclude({
          model: Attachment,
          as: 'postalAttachment',
          attributes: ['id', 'fileName'],
        })
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSPreRegistrationOrganization.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }

  async confirmById(id: number, confirm: ConfirmDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSAddress,
            as: 'address',
            required: true,
            include: [
              {
                attributes: ['id', 'name'],
                model: GSProvince,
                as: 'province',
                required: false,
              },
              {
                attributes: ['id', 'name'],
                model: GSCity,
                as: 'city',
                required: false,
              },
              {
                attributes: ['id', 'name'],
                model: GSNeighborhood,
                as: 'neighborhood',
                required: false,
              },
            ],
          },
        ])
        .thenInclude({
          model: Attachment,
          as: 'licenseAttachment',
          attributes: ['id', 'fileName'],
        })
        .thenInclude({
          model: Attachment,
          as: 'nationalAttachment',
          attributes: ['id', 'fileName'],
        })
        .thenInclude({
          model: Attachment,
          as: 'estateAttachment',
          attributes: ['id', 'fileName'],
        })
        .thenInclude({
          model: Attachment,
          as: 'postalAttachment',
          attributes: ['id', 'fileName'],
        })
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSPreRegistrationOrganization.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSPreRegistrationOrganization.isConfirm'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const addressDto = this.mapper.map(item.address, GSAddress, AddressDto);
    const { result: organization } =
      await this.guaranteeOrganizationService.create({
        name: item.title,
        address: addressDto,
        code: confirm.organizationCode,
        licenseDate: item.licenseDate,
        user: {
          firstname: item.firstname,
          lastname: item.lastname,
          phoneNumber: item.phoneNumber,
        },
      });

    await this.guaranteeOrganizationContractService.create({
      organizationId: organization.id,
      startDate: confirm.startDate,
      endDate: confirm.endDate,
      representativeShare: confirm.representativeShare,
    });

    await this.repository.update(
      { isConfirm: true, confirmDate: new Date() },
      { where: { id: id } },
    );

    await this.preRegistrationSucessSmsSenderQueue.add(
      'PreRegistrationSucessSmsSenderJob',
      {
        firstname: item.firstname,
        lastname: item.lastname,
      },
    );

    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }

  async deleteById(entityId: number, deleteDto: DeleteDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSPreRegistrationOrganization.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSPreRegistrationOrganization.isConfirm'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found'),
      );
    }

    item.isDeleted = true;

    await item.save();

    await this.preRegistrationRejectDescriptionSmsSenderQueue.add(
      'preRegistrationRejectDescriptionSmsSender',
      {
        firstname: item.firstname,
        lastname: item.lastname,
        rejectDescription: deleteDto.rejectDescription,
      },
    );

    return {
      result: item,
    };
  }
}
