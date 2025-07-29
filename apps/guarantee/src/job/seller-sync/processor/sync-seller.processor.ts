import {
  InjectFlowProducer,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { FlowProducer, Job } from 'bullmq';
import {
  SYNC_SELLER_BRAND_QUEUE,
  SYNC_SELLER_FLOW_PRODUCER,
  SYNC_SELLER_PRODUCT_TYPE_QUEUE,
  SYNC_SELLER_QUEUE,
  SYNC_SELLER_VARIANT_QUEUE,
  SYNC_SELLER_WARRANTY_QUEUE,
} from '../constants';
import { DBLogger } from '@rahino/logger';

@Processor(SYNC_SELLER_QUEUE)
export class SellerProcesssor extends WorkerHost {
  constructor(
    @InjectFlowProducer(SYNC_SELLER_FLOW_PRODUCER)
    private readonly fooFlowProducer: FlowProducer,
    private readonly logger: DBLogger,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      console.log('sync job called in interval');
      const job = await this.fooFlowProducer.add({
        name: 'sync-job',
        queueName: SYNC_SELLER_WARRANTY_QUEUE,
        data: {},
        children: [
          {
            name: 'sync-brand',
            queueName: SYNC_SELLER_BRAND_QUEUE,
          },
          {
            name: 'sync-product-type',
            queueName: SYNC_SELLER_PRODUCT_TYPE_QUEUE,
          },
          {
            name: 'sync-variant',
            queueName: SYNC_SELLER_VARIANT_QUEUE,
          },
        ],
      });
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.warn(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }
}
