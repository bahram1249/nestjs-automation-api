import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SYNC_SELLER_BRAND_QUEUE } from '../constants';
import { SellerBrandService } from '@rahino/guarantee/util/seller-brand';

@Processor(SYNC_SELLER_BRAND_QUEUE)
export class SellerBrandProcessor extends WorkerHost {
  constructor(private readonly sellerBrandService: SellerBrandService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const result = await this.sellerBrandService.getAll({});
      console.log(result.data);
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}
