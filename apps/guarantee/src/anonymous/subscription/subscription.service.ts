import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GSSubscription } from '@rahino/localdatabase/models';
import { SubscriptionDto } from './dto';
import { LocalizationService } from 'apps/main/src/common/localization';
import * as _ from 'lodash';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SUBSCRIPTION_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/subscription-sms-sender/constants';
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(GSSubscription)
    private readonly repository: typeof GSSubscription,
    private readonly localizationService: LocalizationService,
    @InjectQueue(SUBSCRIPTION_SMS_SENDER_QUEUE)
    private readonly subscriptionQueue: Queue,
  ) {}

  async create(dto: SubscriptionDto) {
    const duplicate = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.phoneNumber })
        .build(),
    );

    if (duplicate) {
      throw new BadRequestException(
        this.localizationService.translate('guarantee.you_joined_before'),
      );
    }

    const subscription = await this.repository.create({
      phoneNumber: dto.phoneNumber,
    });

    await this.subscriptionQueue.add('send-subscription-sms', {
      phoneNumber: dto.phoneNumber,
    });

    return {
      result: {
        subscriptionDetail: {
          phoneNumber: dto.phoneNumber,
        },
        message: this.localizationService.translate('core.success'),
      },
    };
  }
}
