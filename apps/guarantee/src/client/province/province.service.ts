import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { GSProvince } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(GSProvince) private repository: typeof GSProvince,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll() {
    const queryBuilder = new QueryOptionsBuilder().filter(
      this.seqHelp.whereIsNullColumnEqualToZero('GSProvince.isDeleted', 0),
    );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'slug'])
      .order({ orderBy: 'order', sortOrder: 'asc' })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
