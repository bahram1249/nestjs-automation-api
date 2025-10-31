import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GSRequest } from '@rahino/localdatabase/models';
import { PersianDate } from '@rahino/database';
import { CLIENT_RECEIVING_DEVICE_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-receiving-device-sms-sender/constants';
import { NotificationSenderForClientReceivingDeviceActionService } from './notification-sender-for-client-receiving-device-action.service';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest, PersianDate]),
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
      name: CLIENT_RECEIVING_DEVICE_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForClientReceivingDeviceActionService',
      useClass: NotificationSenderForClientReceivingDeviceActionService,
    },
  ],
})
export class NotificationSenderForClientReceivingDeviceActionModule {}
