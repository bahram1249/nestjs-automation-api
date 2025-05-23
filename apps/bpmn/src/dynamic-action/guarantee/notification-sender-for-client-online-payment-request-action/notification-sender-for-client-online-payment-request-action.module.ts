import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationSenderForClientOnlinePaymentRequestActionService } from './notification-sender-for-client-online-payment-request-action.service';
import { CLIENT_ONLINE_PAYMENT_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-online-payment-request-sms-sender/constants';

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
      name: CLIENT_ONLINE_PAYMENT_REQUEST_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForClientOnlinePaymentRequestActionService',
      useClass: NotificationSenderForClientOnlinePaymentRequestActionService,
    },
  ],
})
export class NotificationSenderForClientOnlinePaymentRequestActionModule {}
