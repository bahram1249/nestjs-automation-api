import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { PRODUCT_DISCOUNT_QUEUE } from './constansts';
import { ProductDiscountService } from './product-discount.service';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import { Inject } from '@nestjs/common';
import { ListFilter } from '@rahino/query-filter';
import * as _ from 'lodash';

@Processor(PRODUCT_DISCOUNT_QUEUE)
export class ProductDiscountProcessor extends WorkerHost {
  constructor(
    private readonly productDiscountService: ProductDiscountService,
    @Inject(emptyListFilter)
    private emptyListFilter: ListFilter,
    private logger: DBLogger,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    const listFilter = _.cloneDeep(this.emptyListFilter);
    listFilter.limit = 10;
    listFilter.offset = 0;
    console.log('initial list filter', listFilter);
    await this.productDiscountService.fetchAndApplyDiscountTime(listFilter);
    return Promise.resolve();
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.warn(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
