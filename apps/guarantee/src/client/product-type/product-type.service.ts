import { Injectable } from '@nestjs/common';
import { GetProductTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSProductType, GSProvider } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import * as _ from 'lodash';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectModel(GSProductType)
    private readonly repository: typeof GSProductType,
  ) {}

  async findAll(filter: GetProductTypeDto) {
    let query = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title', 'description', 'createdAt', 'updatedAt'])
      .include([
        {
          model: GSProvider,
          as: 'provider',
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: 'ASC' });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }
}
