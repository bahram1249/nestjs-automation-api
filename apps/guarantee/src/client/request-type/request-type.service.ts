import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { GSRequestType } from '@rahino/localdatabase/models';

@Injectable()
export class RequestTypeService {
  constructor(
    @InjectModel(GSRequestType) private repository: typeof GSRequestType,
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
