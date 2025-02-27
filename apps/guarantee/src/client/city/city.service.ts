import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { GSCity, GSProvince } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { GetCityDto } from './dto';

@Injectable()
export class CityService {
  constructor(@InjectModel(GSCity) private repository: typeof GSCity) {}

  async findAll(dto: GetCityDto) {
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('GSCity.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    if (dto.provinceId) {
      queryBuilder = queryBuilder.filter({ provinceId: dto.provinceId });
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'slug', 'provinceId', 'neighborhoodBase'])
      .include([
        {
          attributes: ['id', 'name'],
          model: GSProvince,
          as: 'province',
        },
      ])
      .order({ orderBy: 'order', sortOrder: 'asc' })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
