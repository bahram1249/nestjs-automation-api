import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { ECDiscountActionType } from '@rahino/localdatabase/models';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class DiscountActionTypeService {
  constructor(
    @InjectModel(ECDiscountActionType)
    private repository: typeof ECDiscountActionType,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      this.seqHelp.whereIsNullColumnEqualToZero(
        'ECDiscountActionType.isDeleted',
        0,
      ),
    );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder.attributes(['id', 'name']).build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
