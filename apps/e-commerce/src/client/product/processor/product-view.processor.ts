import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ECProductView } from '@rahino/localdatabase/models/ecommerce-eav/ec-product-view.model';
import { ECProduct } from '@rahino/localdatabase/models/ecommerce-eav/ec-product.entity';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { PRODUCT_VIEW_QUEUE } from '../constants';
import { Sequelize } from 'sequelize';

@Processor(PRODUCT_VIEW_QUEUE)
export class ProductViewProcessor extends WorkerHost {
  constructor(
    @InjectModel(ECProductView)
    private readonly productViewRepository: typeof ECProductView,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {
    super();
  }
  async process(
    job: Job<
      { productId: bigint; sessionId: string; userId?: bigint },
      any,
      string
    >,
  ): Promise<any> {
    const { productId, sessionId, userId } = job.data;

    const transaction = await this.sequelize.transaction();
    try {
      await this.productViewRepository.create(
        {
          productId,
          sessionId,
          userId,
        },
        {
          transaction,
        },
      );

      await this.productRepository.increment('viewCount', {
        by: 1,
        where: {
          id: productId,
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
