import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DECREASE_INVENTORY_QUEUE } from '../constants';
import { DBLogger } from '@rahino/logger';
import { DecreaseInventoryService, inventoryStatusService } from '../services';

@Processor(DECREASE_INVENTORY_QUEUE)
export class DecreaseInventoryProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly decreaseInventoryService: DecreaseInventoryService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.paymentId) {
      return Promise.reject('paymentId not provided!');
    }

    if (!job.data.transaction) {
      return Promise.reject('transaction not provided!');
    }

    console.log(job.data.transaction);

    const transaction = job.data.transaction;
    const paymentId = job.data.paymentId;
    try {
      console.log('was here');
      await this.decreaseInventoryService.decreaseByPayment(
        paymentId,
        transaction,
      );
      console.log('after decrease');

      // if payment not success in 1 hour later then reset payment
    } catch (error) {
      return Promise.reject(paymentId);
    }

    return Promise.resolve(paymentId);
  }
}
