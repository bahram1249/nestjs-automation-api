import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECDiscountActionRule } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class DiscountActionRuleService {
  constructor(
    @InjectModel(ECDiscountActionRule)
    private repository: typeof ECDiscountActionRule,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn(
          'isnull',
          Sequelize.col('ECDiscountActionRule.isDeleted'),
          0,
        ),
        {
          [Op.eq]: 0,
        },
      ),
    );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder.attributes(['id', 'name']).build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
