import { Injectable } from '@nestjs/common';
import { GetScheduleSendingTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECScheduleSendingType } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LogisticUserRoleHandlerService } from '../logistic-user-role-handler/logistic-user-role-handler.service';

@Injectable()
export class ScheduleSendingTypeService {
  constructor(
    @InjectModel(ECScheduleSendingType)
    private readonly scheduleSendingTypeRepository: typeof ECScheduleSendingType,
  ) {}

  async findAll(filter: GetScheduleSendingTypeDto) {
    let queryBuilder = new QueryOptionsBuilder().attributes([
      'id',
      'title',
      'icon',
    ]);
    //.order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const count = await this.scheduleSendingTypeRepository.count(
      queryBuilder.build(),
    );

    const result = await this.scheduleSendingTypeRepository.findAll(
      queryBuilder.build(),
    );

    return {
      result: result,
      total: count,
    };
  }
}
