import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/thankfull-success-payment-sms-sender/constants';
import { NotificationSenderForThankfullSuccessPaymentActionService } from './notification-sender-for-thankfull-success-payment-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest]),
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
      name: THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForThankfullSuccessPaymentActionService',
      useClass: NotificationSenderForThankfullSuccessPaymentActionService,
    },
  ],
})
export class NotificationSenderForThankfullSuccessPaymentActionModule {}
