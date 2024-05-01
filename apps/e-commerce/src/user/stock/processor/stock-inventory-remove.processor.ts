import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { StockAvailabilityInventoryService } from '../services';
import { STOCK_INVENTORY_REMOVE_QUEUE } from '../constants';

@Processor(STOCK_INVENTORY_REMOVE_QUEUE)
export class StockInventoryRemoveProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly service: StockAvailabilityInventoryService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.stockId) {
      return Promise.reject('stockId not provided!');
    }

    try {
      const result = await this.service.remove(job.data.stockId);
      return Promise.resolve(result);
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
