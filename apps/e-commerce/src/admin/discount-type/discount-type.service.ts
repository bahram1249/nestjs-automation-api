import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { ECDiscountType } from '@rahino/localdatabase/models';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class DiscountTypeService {
  constructor(
    @InjectModel(ECDiscountType) private repository: typeof ECDiscountType,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscountType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECDiscountType.isFactorBased'),
            0,
          ),
          {
            [Op.ne]: 1,
          },
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'isCouponBased'])
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
