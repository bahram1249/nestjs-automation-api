import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECGuaranteeMonth } from '@rahino/localdatabase/models';

@Injectable()
export class GuaranteeMonthService {
  constructor(
    @InjectModel(ECGuaranteeMonth) private repository: typeof ECGuaranteeMonth,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
        [Op.eq]: 0,
      }),
    );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'monthCount'])
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
