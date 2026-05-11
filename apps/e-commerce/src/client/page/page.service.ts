import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECPage } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(ECPage) private readonly repository: typeof ECPage,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder.filter(
      this.seqHelp.whereIsNullColumnEqualToZero('ECPage.isDeleted', 0),
    );

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'title',
        'slug',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
        'createdAt',
        'updatedAt',
      ])
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy })
      .limit(filter.limit)
      .offset(filter.offset);

    const result = await this.repository.findAll(queryBuilder.build());

    return {
      result: result,
      total: count,
    };
  }

  async findBySlug(slug: string) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
        'createdAt',
        'updatedAt',
      ])
      .filter(this.seqHelp.whereIsNullColumnEqualToZero('ECPage.isDeleted', 0))
      .filter({ slug: slug });
    const page = await this.repository.findOne(queryBuilder.build());
    if (!page) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: page,
    };
  }
}
