import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  GSAddress,
  GSCity,
  GSGuaranteeOrganization,
  GSNeighborhood,
  GSProvince,
  GSRequest,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { User } from '@rahino/database';

@Injectable()
export class OrganizationAddressService {
  constructor(
    @InjectModel(GSAddress)
    private readonly repository: typeof GSAddress,
    @InjectModel(GSGuaranteeOrganization)
    private readonly guaranteeOrganizationRepository: typeof GSGuaranteeOrganization,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAddress(user: User, requestId: bigint) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ id: requestId })
        .build(),
    );
    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    if (!request.organizationId) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found'),
      );
    }
    const organization = await this.guaranteeOrganizationRepository.findOne(
      new QueryOptionsBuilder()
        .include({ model: BPMNOrganization, as: 'organization' })
        .include({ model: User, as: 'user' })
        .filter({ id: request.organizationId })
        .build(),
    );

    const address = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'latitude',
          'longitude',
          'provinceId',
          'cityId',
          'neighborhoodId',
          'street',
          'alley',
          'plaque',
          'floorNumber',
          'postalCode',
        ])
        .filter({ id: organization.addressId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSAddress.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            attributes: ['id', 'name'],
            model: GSProvince,
            as: 'province',
          },
          {
            attributes: ['id', 'name'],
            model: GSCity,
            as: 'city',
          },
          {
            attributes: ['id', 'name'],
            model: GSNeighborhood,
            as: 'neighborhood',
          },
        ])
        .build(),
    );
    if (!address) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    return {
      result: {
        orgnizationDetail: {
          name: organization.organization.name,
          phoneNumber: organization.user.phoneNumber,
        },
        address: address,
      },
    };
  }
}
