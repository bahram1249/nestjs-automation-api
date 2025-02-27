import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECPage } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(ECPage) private readonly repository: typeof ECPage,
  ) {}

  async findAll(filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECPage.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
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
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECPage.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
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
