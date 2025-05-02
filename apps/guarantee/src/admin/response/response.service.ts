import { Injectable, NotFoundException } from '@nestjs/common';
import { GetResponseDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSAnswerOption,
  GSAnswerRecord,
  GSQuestion,
  GSResponse,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { User } from '@rahino/database';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(GSResponse)
    private readonly repository: typeof GSResponse,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetResponseDto) {
    let query = new QueryOptionsBuilder().filter({});

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'requestId', 'userId', 'fromScore', 'totalScore'])
      .include([
        {
          model: GSAnswerRecord,
          as: 'answerRecords',
          include: [
            {
              model: GSQuestion,
              as: 'question',
            },
            {
              model: GSAnswerOption,
              as: 'answerOption',
            },
          ],
        },
        {
          model: User,
          as: 'user',
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'requestId', 'userId', 'fromScore', 'totalScore'])
        .include([
          {
            model: GSAnswerRecord,
            as: 'answerRecords',
            include: [
              {
                model: GSQuestion,
                as: 'question',
              },
              {
                model: GSAnswerOption,
                as: 'answerOption',
              },
            ],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          },
        ])
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }
}
