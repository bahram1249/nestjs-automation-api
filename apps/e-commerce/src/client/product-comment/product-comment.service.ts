import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@rahino/database';
import { ProductCommentDto } from './dto';
import { ListFilter } from '@rahino/query-filter';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { ProductCommentStatusEnum } from '../../shared/enum';
import { ECProductCommentStatus } from '@rahino/localdatabase/models';
import { ECProductCommentFactor } from '@rahino/localdatabase/models';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { PublishStatusEnum } from '../../client/product/enum';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductCommentService {
  constructor(
    @InjectModel(ECProductComment)
    private readonly repository: typeof ECProductComment,
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
    @InjectModel(ECEntityTypeFactor)
    private readonly entityTypeFactorRepository: typeof ECEntityTypeFactor,
    @InjectModel(ECProductCommentFactor)
    private readonly productCommentFactorRepository: typeof ECProductCommentFactor,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async possibleFactors(productId: bigint) {
    const product = await this.productRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: productId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ publishStatusId: PublishStatusEnum.publish })
        .build(),
    );
    if (!product) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const queryOptions = new QueryOptionsBuilder()
      .filter({ entityTypeId: product.entityTypeId })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECEntityTypeFactor.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .order({ orderBy: 'priority', sortOrder: 'ASC' })
      .build();

    const count = await this.entityTypeFactorRepository.count(queryOptions);
    const result = await this.entityTypeFactorRepository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async findAll(productId: bigint, filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder()
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
      .filter({ entityId: productId });
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'entityId',
        'statusId',
        'description',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: [
            'id',
            'description',
            'statusId',
            'createdAt',
            'updatedAt',
          ],
          model: ECProductComment,
          as: 'replies',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECProductCommentStatus,
              as: 'status',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'name'],
          model: ECProductCommentStatus,
          as: 'status',
          required: false,
        },
        {
          attributes: ['id', 'commentId', 'factorId', 'score'],
          model: ECProductCommentFactor,
          as: 'commentFactors',
          include: [
            {
              attributes: ['id', 'name'],
              model: ECEntityTypeFactor,
              as: 'factor',
              required: false,
            },
          ],
          required: false,
        },
        {
          attributes: ['id', 'firstname', 'lastname'],
          model: User,
          as: 'user',
          required: false,
        },
      ])
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: count,
    };
  }

  async create(user: User, dto: ProductCommentDto) {
    const product = await this.productRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.productId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ publishStatusId: PublishStatusEnum.publish })
        .build(),
    );
    if (!product) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: product.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!entityType) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const entityTypeFactors = await this.entityTypeFactorRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ entityTypeId: entityType.id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECEntityTypeFactor.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (entityTypeFactors.length != dto.entityTypeFactors.length) {
      throw new BadRequestException(
        'something wrong in your entity type factors',
      );
    }

    for (let index = 0; index < entityTypeFactors.length; index++) {
      const entityTypeFactor = entityTypeFactors[index];
      const findItem = dto.entityTypeFactors.find(
        (item) => item.id == entityTypeFactor.id,
      );
      if (!findItem) {
        throw new NotFoundException(
          this.i18n.t('core.not_found_id', {
            lang: I18nContext.current().lang,
          }),
        );
      }
    }

    const insertingItem = {
      entityId: dto.productId,
      description: dto.description,
      userId: user.id,
      statusId: ProductCommentStatusEnum.waiting,
    };

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    let comment: ECProductComment = null;
    try {
      comment = await this.repository.create(insertingItem, {
        transaction: transaction,
      });

      for (let index = 0; index < dto.entityTypeFactors.length; index++) {
        const entityTypeFactor = dto.entityTypeFactors[index];
        const insertProductCommentFactor =
          await this.productCommentFactorRepository.create(
            {
              commentId: comment.id,
              entityId: product.id,
              factorId: entityTypeFactor.id,
              score: entityTypeFactor.score,
            },
            { transaction: transaction },
          );
      }

      await transaction.commit();
    } catch (error) {
      throw new InternalServerErrorException('something failed');
    }
    return {
      result: comment,
    };
  }
}
