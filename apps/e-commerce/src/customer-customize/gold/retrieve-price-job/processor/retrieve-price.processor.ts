import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { RETRIEVE_PRICE_QUEUE } from '../constants';
import { RetrievePricePersianApiService } from '../services';

@Processor(RETRIEVE_PRICE_QUEUE)
export class RetrievePriceProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly retrievePricePersianApiServie: RetrievePricePersianApiService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      await this.retrievePricePersianApiServie.run();
      return Promise.resolve();
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
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
