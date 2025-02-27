import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Op, Sequelize } from 'sequelize';
import { GetNeighborhoodDto } from './dto';
import { GSCity, GSNeighborhood } from '@rahino/localdatabase/models';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectModel(GSNeighborhood) private repository: typeof GSNeighborhood,
  ) {}

  async findAll(dto: GetNeighborhoodDto) {
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('GSNeighborhood.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    if (dto.cityId) {
      queryBuilder = queryBuilder.filter({ cityId: dto.cityId });
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'slug', 'cityId'])
      .include([
        {
          attributes: ['id', 'name'],
          model: GSCity,
          as: 'city',
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
