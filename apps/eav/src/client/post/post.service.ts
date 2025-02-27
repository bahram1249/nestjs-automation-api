import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  EAVBlogPublish,
  EAVEntityType,
  EAVPost,
} from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { PublishEnum } from './enum';

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
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachments',
            required: false,
            through: {
              attributes: [],
            },
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
    let queryBuilder = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ publishId: PublishEnum.Publish });

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
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
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachments',
          required: false,
          through: {
            attributes: [],
          },
        },
      ])
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .limit(filter.limit)
      .offset(filter.offset);

    const results = await this.repository.findAll(queryBuilder.build());
    return {
      result: results,
      total: count,
    };
  }
}
