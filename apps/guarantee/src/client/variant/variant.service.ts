import { Injectable } from '@nestjs/common';
import { GetVariantDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSProvider, GSVariant } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import * as _ from 'lodash';

@Injectable()
export class VariantService {
  constructor(
    @InjectModel(GSVariant)
    private readonly repository: typeof GSVariant,
  ) {}

  async findAll(filter: GetVariantDto) {
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
