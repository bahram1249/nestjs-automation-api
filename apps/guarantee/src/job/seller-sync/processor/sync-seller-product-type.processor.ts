import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SYNC_SELLER_PRODUCT_TYPE_QUEUE } from '../constants';

@Processor(SYNC_SELLER_PRODUCT_TYPE_QUEUE)
export class SellerProductTypeProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      console.log('in seller product type');
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}
