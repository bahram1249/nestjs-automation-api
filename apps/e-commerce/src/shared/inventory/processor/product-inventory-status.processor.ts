import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '../constants';
import { DBLogger } from '@rahino/logger';
import { inventoryStatusService } from '../services';

@Processor(PRODUCT_INVENTORY_STATUS_QUEUE)
export class ProductInventoryStatusProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly inventoryStatusService: inventoryStatusService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.productId) {
      return Promise.reject('productId not provided!');
    }
    const productId: bigint = job.data.productId;
    await this.inventoryStatusService.productInventoryStatusUpdate(productId);
    return Promise.resolve(productId);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }
}
