import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { ECProvince } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { GetCityDto } from './dto';
import { ECCity } from '@rahino/localdatabase/models';

@Injectable()
export class CityService {
  constructor(@InjectModel(ECCity) private repository: typeof ECCity) {}

  async findAll(dto: GetCityDto) {
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECCity.isDeleted'), 0),
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
          model: ECProvince,
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
