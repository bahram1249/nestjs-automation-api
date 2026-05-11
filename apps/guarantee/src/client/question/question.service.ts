import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { GSAnswerOption, GSQuestion } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(GSQuestion) private repository: typeof GSQuestion,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      this.seqHelp.whereIsNullColumnEqualToZero('GSQuestion.isDeleted', 0),
    );

    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'title', 'maxWeight'])
      .include([
        {
          attributes: ['id', 'title'],
          model: GSAnswerOption,
          as: 'answerOptions',
        },
      ])
      .order({ orderBy: 'priority', sortOrder: 'asc' })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
