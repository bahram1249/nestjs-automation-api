import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EAVBlogPublish, EAVEntityType, EAVPost } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(EAVPost) private readonly repository: typeof EAVPost,
  ) {}

  async findBySlug(slug: string) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'slug',
          'description',
          'entityTypeId',
          'publishId',
        ])
        .include([
          {
            model: EAVBlogPublish,
            as: 'publish',
            attributes: ['id', 'name'],
          },
          {
            model: EAVEntityType,
            as: 'entityType',
            attributes: ['id', 'name', 'slug'],
          },
        ])
        .filter({ slug: slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    return {
      result: item,
    };
  }
  async findAll(filter: ListFilter) {
    const results = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'slug',
          'description',
          'entityTypeId',
          'publishId',
        ])
        .include([
          {
            model: EAVBlogPublish,
            as: 'publish',
            attributes: ['id', 'name'],
          },
          {
            model: EAVEntityType,
            as: 'entityType',
            attributes: ['id', 'name', 'slug'],
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
        .limit(filter.limit)
        .offset(filter.offset)
        .build(),
    );
    return {
      result: results,
    };
  }
}
