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
    @InjectModel(BPMNOrganization)
    private readonly organizationRepository: typeof BPMNOrganization,
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
    const guaranteeOrganization =
      await this.guaranteeOrganizationRepository.findOne(
        new QueryOptionsBuilder()
          .include({ model: User, as: 'user' })
          .filter({ id: request.organizationId })
          .build(),
      );

    const organization = await this.organizationRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: guaranteeOrganization.id })
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
        .filter({ id: guaranteeOrganization.addressId })
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
            required: false,
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
          name: organization.name,
          phoneNumber: guaranteeOrganization.user.phoneNumber,
        },
        address: address,
      },
    };
  }
}
