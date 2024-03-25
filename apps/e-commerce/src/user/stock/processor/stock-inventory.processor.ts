import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { StockAvailabilityInventoryService } from '../services';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { StockDto } from '../dto';
import { STOCK_INVENTORY_QUEUE } from '../constants';

@Processor(STOCK_INVENTORY_QUEUE)
export class StockInventoryProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly service: StockAvailabilityInventoryService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    let progress: number = 0;
    job.updateProgress(progress);
    progress = 20;
    if (!job.data.session) {
      progress = 100;
      job.updateProgress(progress);
      return Promise.reject('productId not provided!');
    }
    if (!job.data.dto) {
      progress = 100;
      job.updateProgress(progress);
      return Promise.reject('data not provided!');
    }

    try {
      const session: ECUserSession = job.data.session;
      const dto: StockDto = job.data.dto;
      progress = 50;
      job.updateProgress(progress);
      const result = await this.service.insert(session, dto);
      progress = 100;
      job.updateProgress(progress);
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
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
