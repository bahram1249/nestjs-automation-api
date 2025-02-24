import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SYNC_SELLER_BRAND_QUEUE } from '../constants';

@Processor(SYNC_SELLER_BRAND_QUEUE)
export class SellerBrandProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      console.log('in seller brand');
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}
