import { BadRequestException, Injectable } from '@nestjs/common';
import { GetOrganizationDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  GSAddress,
  GSCity,
  GSGuaranteeOrganization,
  GSProvince,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class AnonymousOrganizationService {
  constructor(
    @InjectModel(GSGuaranteeOrganization)
    private readonly repository: typeof GSGuaranteeOrganization,
  ) {}

  async findAll(filter: GetOrganizationDto) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          model: GSAddress,
          as: 'address',
          required: true,
          include: [
            {
              model: GSProvince,
              as: 'province',
              required: true,
            },
            {
              model: GSCity,
              as: 'city',
              required: true,
            },
          ],
        },
      ])
      .thenInclude({
        attributes: ['id', 'name'],
        model: BPMNOrganization,
        as: 'organization',
        required: true,
        where: {
          name: {
            [Op.like]: filter.search,
          },
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganization.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )

      .filter(
        Sequelize.literal(
          `EXISTS (
          SELECT 1
          FROM GSGuaranteeOrganizationContracts GGOC
          WHERE GGOC.organizationId = GSGuaranteeOrganization.id
          AND GETDATE() BETWEEN GGOC.startDate AND GGOC.endDate
        )`.replaceAll(/\s\s+/g, ' '),
        ),
      )
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy });

    const count = await this.repository.count(query.build());
    const queryResults = await this.repository.findAll(query.build());
    const mappedItems = queryResults.map((item) => {
      return {
        id: item.id,
        name: item.organization.name,
        provinceName: item.address.province.name,
        cityName: item.address.city.name,
        code: item.code ?? null,
      };
    });

    return {
      result: mappedItems,
      total: count,
    };
  }
}
