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
    let progress: number = 0;
    job.updateProgress(progress);
    progress = 20;
    if (!job.data.productId) {
      progress = 100;
      job.updateProgress(progress);
      return Promise.reject('productId not provided!');
    }
    job.updateProgress(progress);
    const productId: bigint = job.data.productId;
    progress = 50;
    job.updateProgress(progress);
    await this.inventoryStatusService.productInventoryStatusUpdate(productId);
    progress = 100;
    job.updateProgress(progress);
    return Promise.resolve(productId);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
