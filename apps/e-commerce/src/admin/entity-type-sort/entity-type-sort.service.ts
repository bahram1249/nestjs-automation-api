import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { ECEntityTypeSort } from '@rahino/localdatabase/models';

@Injectable()
export class EntityTypeSortService {
  constructor(
    @InjectModel(ECEntityTypeSort)
    private readonly repository: typeof ECEntityTypeSort,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder();
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder.attributes(['id', 'title']).build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
