import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmDto, GetPreRegistrationOrganization } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSAddress,
  GSCity,
  GSNeighborhood,
  GSPreRegistrationOrganization,
  GSProvince,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { Attachment } from '@rahino/database';
import { GuaranteeOrganizationService } from '../guarantee-organization';
import { GuaranteeOrganizationContractService } from '../guarantee-organization-contract';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AddressDto } from '@rahino/guarantee/client/address/dto';

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

    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }

  async deleteById(entityId: number) {
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

        .build(),
    );

    item.isDeleted = true;

    await item.save();

    return {
      result: item,
    };
  }
}
