import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { ECProductComment } from '@rahino/localdatabase/models';
import { ProductCommentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { ECProductCommentStatus } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECProductCommentFactor } from '@rahino/localdatabase/models';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(ECProductComment) private repository: typeof ECProductComment,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let builder = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECProductComment.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ statusId: ProductCommentStatusEnum.confirm })
      .filter({ userId: user.id });

    const count = await this.repository.count(builder.build());

    builder = builder
      .attributes([
        'id',
        'description',
        'statusId',
        'userId',
        'replyId',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: ECProductCommentStatus,
          as: 'status',
          required: false,
        },
        {
          attributes: ['id', 'title', 'sku', 'slug'],
          model: ECProduct,
          as: 'product',
          required: false,
        },
        {
          attributes: ['id', 'firstname', 'lastname'],
          model: User,
          as: 'user',
          required: false,
        },
        {
          attributes: ['id', 'commentId', 'entityId', 'factorId', 'score'],
          model: ECProductCommentFactor,
          as: 'commentFactors',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECEntityTypeFactor,
              as: 'factor',
              required: false,
            },
          ],
        },
      ])
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(builder.build());
    return {
      result: result,
      total: count,
    };
  }
}
