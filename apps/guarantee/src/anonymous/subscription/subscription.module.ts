import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSSubscription } from '@rahino/localdatabase/models';
import { SubscriptionController } from './subscription.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SUBSCRIPTION_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/subscription-sms-sender/constants';

@Module({
  imports: [
    LocalizationModule,
    SequelizeModule.forFeature([GSSubscription]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: SUBSCRIPTION_SMS_SENDER_QUEUE,
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class AnonymousSubscriptionModule {}
