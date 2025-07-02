import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUERY_NEXT_PAGE_PRODUCT_WITH_LAT_LON_QUEUE } from '../constants';
import { GetProductLatLonDto } from '../dto';
import { ProductRepositoryService } from '../service/product-repository.service';
import { DBLogger } from '@rahino/logger';

@Processor(QUERY_NEXT_PAGE_PRODUCT_WITH_LAT_LON_QUEUE)
export class QueryNextPageProductWithLatLonProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly service: ProductRepositoryService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    const filter: GetProductLatLonDto = job.data.filter;

    filter.offset = filter.offset + filter.limit;

    await this.service.findAllWithLatLon(filter);

    return Promise.resolve(true);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }
}
