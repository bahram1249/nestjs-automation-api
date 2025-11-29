import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECProductCommentFactor } from '@rahino/localdatabase/models';
import { ECProductComment } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ProductCommentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class CalculateCommentScoreService {
  constructor(
    @InjectModel(ECProductComment)
    private readonly repository: typeof ECProductComment,
    @InjectModel(ECProductCommentFactor)
    private readonly factorRepository: typeof ECProductCommentFactor,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
  ) {}

  async calculateCommentScore(commentId: bigint) {
    let comment = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: commentId })
        //.filter({ statusId: ProductCommentStatusEnum.confirm })
        .build(),
    );
    if (!comment) {
      throw new InternalServerErrorException(
        'the comment with this given id not founded!',
      );
    }
    // calculate score of factor, otherwise set 5 as default
    const result = await this.factorRepository.findAll(
      new QueryOptionsBuilder()
        .attributes([
          [
            Sequelize.fn(
              'isnull',
              Sequelize.fn(
                'avg',
                Sequelize.col('ECProductCommentFactor.score'),
              ),
              5,
            ),
            'score',
          ],
          [Sequelize.fn('count', '*'), 'cntFactor'],
        ])
        .filter({ commentId: comment.id })
        .raw(true)
        .build(),
    );
    comment.score = result[0]['score'];
    comment.cntFactor = result[0]['cntFactor'];
    comment = await comment.save();
    return await this.calcualteProductCommentScore(comment.entityId);
  }

  async calcualteProductCommentScore(productId: bigint) {
    const product = await this.productRepository.findOne(
      new QueryOptionsBuilder().filter({ id: productId }).build(),
    );
    if (!product) {
      throw new InternalServerErrorException(
        'the product with this given id not founded!',
      );
    }
    const comment = await this.repository.findAll(
      new QueryOptionsBuilder()
        .attributes([
          [
            Sequelize.fn(
              'isnull',
              Sequelize.fn('avg', Sequelize.col('ECProductComment.score')),
              5,
            ),
            'score',
          ],
          [Sequelize.fn('count', '*'), 'cntComment'],
        ])
        .filter({ entityId: product.id })
        .filter({ statusId: ProductCommentStatusEnum.confirm })
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
        .raw(true)
        .build(),
    );
    product.score = comment[0]['score'];
    product.cntComment = comment[0]['cntComment'];
    return await product.save();
  }
}
