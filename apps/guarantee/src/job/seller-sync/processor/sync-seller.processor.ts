import { InjectFlowProducer, Processor, WorkerHost } from '@nestjs/bullmq';
import { FlowProducer, Job } from 'bullmq';
import {
  SYNC_SELLER_BRAND_QUEUE,
  SYNC_SELLER_FLOW_PRODUCER,
  SYNC_SELLER_PRODUCT_TYPE_QUEUE,
  SYNC_SELLER_QUEUE,
  SYNC_SELLER_VARIANT_QUEUE,
  SYNC_SELLER_WARRANTY_QUEUE,
} from '../constants';

@Processor(SYNC_SELLER_QUEUE)
export class SellerProcesssor extends WorkerHost {
  constructor(
    @InjectFlowProducer(SYNC_SELLER_FLOW_PRODUCER)
    private readonly fooFlowProducer: FlowProducer,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
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
}
