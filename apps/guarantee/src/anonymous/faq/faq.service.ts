import { Injectable } from '@nestjs/common';
import { GetFaqDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSFaq } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(GSFaq)
    private readonly repository: typeof GSFaq,
  ) {}

  async findAll(filter: GetFaqDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        question: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'question',
        'answer',
        'priority',
        'createdAt',
        'updatedAt',
      ])
      .order({ orderBy: 'priority', sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }
}
