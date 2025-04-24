import { Injectable } from '@nestjs/common';
import { GetRequestTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSRequestType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class CartableRequestTypeService {
  constructor(
    @InjectModel(GSRequestType)
    private readonly requestTypeRepository: typeof GSRequestType,
  ) {}

  async findAll(filter: GetRequestTypeDto) {
    let query = new QueryOptionsBuilder();

    const count = await this.requestTypeRepository.count(query.build());

    query = query
      .attributes(['id', 'title'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy });

    const result = await this.requestTypeRepository.findAll(query.build());

    return {
      result: result,
      total: count,
    };
  }
}
