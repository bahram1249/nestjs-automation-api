import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { ECProvince } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ProvinceService {
  constructor(@InjectModel(ECProvince) private repository: typeof ECProvince) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
        [Op.eq]: 0,
      }),
    );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'slug'])
      .order({ orderBy: 'order', sortOrder: 'asc' })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
