import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { GSShippingWay } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { ListFilter } from '@rahino/query-filter';

@Injectable()
export class ShippingWayService {
  constructor(
    @InjectModel(GSShippingWay) private repository: typeof GSShippingWay,
  ) {}

  async findAll(requestId: bigint, dto: ListFilter) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSShippingWay.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ isCartableSide: true });

    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'title', 'icon'])
      .build();

    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
