import { Injectable } from '@nestjs/common';
import { GetScheduleSendingTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { ECScheduleSendingType } from '@rahino/localdatabase/models';

@Injectable()
export class ScheduleSendingTypeService {
  constructor(
    @InjectModel(ECScheduleSendingType)
    private readonly scheduleSendingTypeRepository: typeof ECScheduleSendingType,
  ) {}

  async findAll(filter: GetScheduleSendingTypeDto) {
    const queryBuilder = new QueryOptionsBuilder();
    //.order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const count = await this.scheduleSendingTypeRepository.count(
      queryBuilder.build(),
    );

    const result = await this.scheduleSendingTypeRepository.findAll(
      queryBuilder.attributes(['id', 'title', 'icon']).build(),
    );

    return {
      result: result,
      total: count,
    };
  }
}
