import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUERY_NEXT_PAGE_PRODUCT_QUEUE } from '../constants';
import { GetProductDto } from '../dto';
import { ProductRepositoryService } from '../service/product-repository.service';

@Processor(QUERY_NEXT_PAGE_PRODUCT_QUEUE)
export class QueryNextPageProductProcessor extends WorkerHost {
  constructor(private readonly service: ProductRepositoryService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    const filter: GetProductDto = job.data.filter;
    filter.offset = filter.offset + filter.limit;
    await this.service.findAllAndCount(filter);
    return Promise.resolve(true);
  }
}
