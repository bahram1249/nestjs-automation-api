import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ConfirmCommentDto, GetProductCommentDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ECProductComment } from '@rahino/localdatabase/models';
import { ECProductCommentStatus } from '@rahino/localdatabase/models';
import { ECProductCommentFactor } from '@rahino/localdatabase/models';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';
import { ProductCommentStatusEnum } from '@rahino/ecommerce/shared/enum/product-comment-status.enum';
import { SCORE_COMMENT_JOB, SCORE_COMMENT_QUEUE } from './constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ECProduct } from '@rahino/localdatabase/models';

@Injectable()
export class ProductCommentService {
  constructor(
    @InjectModel(ECProductComment)
    private readonly repository: typeof ECProductComment,
    private readonly i18n: I18nService<I18nTranslations>,

    @InjectQueue(SCORE_COMMENT_QUEUE)
    private scoreCommentQueue: Queue,
  ) {}

  async findAll(user: User, filter: GetProductCommentDto) {
    let builder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECProductComment.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    if (filter.commentStatusId) {
      builder = builder.filter({ statusId: filter.commentStatusId });
    }

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
          attributes: ['id', 'title', 'sku'],
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
          attributes: ['id', 'description', 'entityId', 'statusId'],
          model: ECProductComment,
          as: 'reply',
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

  async findById(id: bigint, user: User) {
    const builder = new QueryOptionsBuilder()
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
      .filter({ id: id })
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
          attributes: ['id', 'title', 'sku'],
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
          attributes: ['id', 'description', 'entityId', 'statusId'],
          model: ECProductComment,
          as: 'reply',
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
      ]);

    const result = await this.repository.findOne(builder.build());

    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return {
      result: result,
    };
  }

  async rejectComment(commentId: bigint, user: User) {
    let comment = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: commentId })
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
        .build(),
    );
    if (!comment) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    comment.isDeleted = true;
    comment = await comment.save();

    // calculate score comment
    await this.scoreCommentQueue.add(
      SCORE_COMMENT_JOB,
      {
        commentId: comment.id,
      },
      { removeOnComplete: true },
    );

    return {
      result: comment,
    };
  }

  async confirmComment(commentId: bigint, user: User, dto: ConfirmCommentDto) {
    let comment = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: commentId })
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
        .build(),
    );
    if (!comment) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    if (dto.description) {
      // create admin reply comment
      await this.repository.create({
        replyId: comment.id,
        description: dto.description,
        userId: user.id,
        statusId: ProductCommentStatusEnum.adminReply,
      });
    }

    // TODO confirm date

    comment.statusId = ProductCommentStatusEnum.confirm;
    comment = await comment.save();

    // calculate score comment
    await this.scoreCommentQueue.add(
      SCORE_COMMENT_JOB,
      {
        commentId: comment.id,
      },
      { removeOnComplete: true },
    );

    return {
      result: comment,
    };
  }
}
