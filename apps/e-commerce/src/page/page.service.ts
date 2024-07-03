import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECPage } from '@rahino/database/models/ecommerce-eav/ec-page.entity';

@Injectable()
export class PageService {
  constructor(@InjectModel(ECPage) private repository: typeof ECPage) {}

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
