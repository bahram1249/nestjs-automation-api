import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
import { ECDiscountConditionType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class DiscountConditionTypeService {
  constructor(
    @InjectModel(ECDiscountConditionType)
    private repository: typeof ECDiscountConditionType,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      this.seqHelp.whereIsNullColumnEqualToZero(
        'ECDiscountConditionType.isDeleted',
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
