import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { ListFilter } from '@rahino/query-filter';
import { ECProductComment } from '@rahino/database/models/ecommerce-eav/ec-product-comment.entity';
import { ProductCommentStatusEnum } from '@rahino/ecommerce/util/enum';
import { ECProductCommentStatus } from '@rahino/database/models/ecommerce-eav/ec-comment-status.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECProductCommentFactor } from '@rahino/database/models/ecommerce-eav/ec-product-comment-factor.entity';
import { ECEntityTypeFactor } from '@rahino/database/models/ecommerce-eav/ec-entitytype-factor.entity';

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
