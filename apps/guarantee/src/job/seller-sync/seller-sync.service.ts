import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';
import {
  SYNC_SELLER_BRAND_QUEUE,
  SYNC_SELLER_FLOW_PRODUCER,
  SYNC_SELLER_PRODUCT_TYPE_QUEUE,
  SYNC_SELLER_VARIANT_QUEUE,
  SYNC_SELLER_WARRANTY_QUEUE,
} from './constants';

@Injectable()
export class SellerSyncService {
  constructor(
    @InjectFlowProducer(SYNC_SELLER_FLOW_PRODUCER)
    private fooFlowProducer: FlowProducer,
  ) {}

  async sync() {
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
  }
}
