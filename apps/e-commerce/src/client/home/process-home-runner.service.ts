import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { HOME_PAGE_JOB, HOME_PAGE_QUEUE } from './constants';

@Injectable()
export class ProcessHomeRunnerService {
  constructor(
    @InjectQueue(HOME_PAGE_QUEUE)
    private readonly homePageQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  run() {
    // const tommorow = new Date(new Date().setDate(new Date().getDate() + 1));
    // const targetTime = new Date(tommorow.setHours(3, 15, 0, 0));
    // const delay = Number(targetTime) - Number(new Date());
    return this.homePageQueue.add(
      HOME_PAGE_JOB,
      {},
      {
        removeOnComplete: true,
      },
    );
  }
}
