import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { ECNotification } from '@rahino/localdatabase/models';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(ECNotification) private repository: typeof ECNotification,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder.filter(
      this.seqHelp.whereIsNullColumnEqualToZero('ECNotification.isDeleted', 0),
    );

    const count = await this.repository.count(queryBuilder.build());
    const result = await this.repository.findAll(
      queryBuilder
        .offset(filter.offset)
        .limit(filter.limit)
        .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy })
        .build(),
    );
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero(
          'ECNotification.isDeleted',
          0,
        ),
      )
      .filter({ id: entityId });
    const notification = await this.repository.findOne(queryBuilder.build());
    if (!notification) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: notification,
    };
  }
}
