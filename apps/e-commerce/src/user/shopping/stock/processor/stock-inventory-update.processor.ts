import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { StockAvailabilityInventoryService } from '../services';
import { ECUserSession } from '@rahino/localdatabase/models';
import { StockDto } from '../dto';
import { STOCK_INVENTORY_UPDATE_QUEUE } from '../constants';

@Processor(STOCK_INVENTORY_UPDATE_QUEUE)
export class StockInventoryUpdateProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly service: StockAvailabilityInventoryService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.session) {
      return Promise.reject('productId not provided!');
    }
    if (!job.data.dto) {
      return Promise.reject('data not provided!');
    }

    try {
      const session: ECUserSession = job.data.session;
      const dto: StockDto = job.data.dto;
      const result = await this.service.update(session, dto);
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // @OnWorkerEvent('failed')
  // onFailed(job: Job) {
  //   const { id, name, queueName, failedReason } = job;
  //   this.logger.error(
  //     `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
  //   );
  // }
}
