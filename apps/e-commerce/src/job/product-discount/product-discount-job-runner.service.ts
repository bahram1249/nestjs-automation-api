import { Injectable } from '@nestjs/common';
import { PRODUCT_DISCOUNT_JOB, PRODUCT_DISCOUNT_QUEUE } from './constansts';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductDiscountJobRunnerService {
  constructor(
    @InjectQueue(PRODUCT_DISCOUNT_QUEUE)
    private readonly productDiscountQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  run() {
    // const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));
    // const targetTime = new Date(tommorow.setHours(3, 15, 0, 0));
    // const delay = Number(targetTime) - Number(new Date());
    return this.productDiscountQueue.add(
      PRODUCT_DISCOUNT_JOB,
      {},
      {
        removeOnComplete: true,
        //delay: delay,
        backoff: {
          delay: 600000, //3600000,
          type: 'fixed',
        },
        repeat: {
          pattern: '*/15 * * * *',
        },
      },
    );
  }
}
