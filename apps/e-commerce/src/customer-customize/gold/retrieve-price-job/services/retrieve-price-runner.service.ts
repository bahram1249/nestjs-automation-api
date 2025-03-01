import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { InjectQueue } from '@nestjs/bullmq';
import { RETRIEVE_PRICE_JOB, RETRIEVE_PRICE_QUEUE } from '../constants';
import { Queue } from 'bullmq';

@Injectable()
export class RetrievePriceRunnerService {
  constructor(
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectQueue(RETRIEVE_PRICE_QUEUE)
    private retrievePriceQueue: Queue,
  ) {}

  public async run() {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key: 'CUSTOMER_NAME' }).build(),
    );
    console.log(setting.value);
    if (setting.value == 'goldongallery' || setting.value == 'pegahgallery') {
      await this.retrievePriceQueue.add(
        RETRIEVE_PRICE_JOB,
        {},
        {
          removeOnComplete: true,
          //delay: delay,
          backoff: {
            delay: 600000, //3600000,
            type: 'fixed',
          },
          repeat: {
            pattern: '*/10 * * * *',
          },
        },
      );
    }
  }
}
