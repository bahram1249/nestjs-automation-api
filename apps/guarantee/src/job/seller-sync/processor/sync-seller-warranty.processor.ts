import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SYNC_SELLER_WARRANTY_QUEUE } from '../constants';

@Processor(SYNC_SELLER_WARRANTY_QUEUE)
export class SellerWarrantyProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      console.log('in seller warranty');
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}
