import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { ECDiscountActionType } from '@rahino/localdatabase/models';

@Injectable()
export class DiscountActionTypeService {
  constructor(
    @InjectModel(ECDiscountActionType)
    private repository: typeof ECDiscountActionType,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn(
          'isnull',
          Sequelize.col('ECDiscountActionType.isDeleted'),
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
