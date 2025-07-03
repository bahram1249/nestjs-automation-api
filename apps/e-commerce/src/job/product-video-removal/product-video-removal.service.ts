import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import {
  REMOVE_PRODUCT_VIDEO_JOB,
  REMOVE_PRODUCT_VIDEO_QUEUE,
} from './constants';
import { Queue } from 'bullmq';

@Injectable()
export class ProductVideoRemovalService {
  constructor(
    @InjectQueue(REMOVE_PRODUCT_VIDEO_QUEUE) private removeQueue: Queue,
  ) {}

  run() {
    const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));
    const targetTime = new Date(tommorow.setHours(3, 15, 0, 0));
    const delay = Number(targetTime) - Number(new Date());

    return this.removeQueue.add(
      REMOVE_PRODUCT_VIDEO_JOB,
      {},
      {
        removeOnComplete: true,
        //delay: delay,
        backoff: {
          delay: 3600000,
          type: 'fixed',
        },
        repeat: {
          pattern: '15 3 * * *',
        },
      },
    );
  }
}
