import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { InjectModel } from '@nestjs/sequelize';
import { ECShoppingCartProduct } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { SHOPPING_CART_PRODUCT_REMOVE_QUEUE } from '../constants';

@Processor(SHOPPING_CART_PRODUCT_REMOVE_QUEUE)
export class ShoppingCartProductRemove extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    @InjectModel(ECShoppingCartProduct)
    private readonly shoppingCartProductRepository: typeof ECShoppingCartProduct,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.shoppingCartId) {
      return Promise.reject('shopping cart id not provided!');
    }

    if (!job.data.shoppingCartProductId) {
      return Promise.reject('shopping cart product id not provided!');
    }

    try {
      const shoppingCartProduct =
        await this.shoppingCartProductRepository.findOne(
          new QueryOptionsBuilder()
            .filter({
              id: job.data.shoppingCartProductId,
            })
            .filter({
              shoppingCartId: job.data.shoppingCartId,
            })
            .build(),
        );

      shoppingCartProduct.isDeleted = true;
      await shoppingCartProduct.save();
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }
}
