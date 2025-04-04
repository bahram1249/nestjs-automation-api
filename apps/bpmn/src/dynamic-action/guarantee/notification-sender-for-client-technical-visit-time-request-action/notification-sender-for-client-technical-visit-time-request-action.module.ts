import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { GSRequest } from '@rahino/localdatabase/models';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationSenderForClientTechnicalVisitTimeRequestActionService } from './notification-sender-for-client-technical-visit-time-request-action.service';
import { CLIENT_TECHNICAL_USER_VISIT_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-technical-user-visit-request-sms-sender/constants';

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
      name: CLIENT_TECHNICAL_USER_VISIT_REQUEST_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide:
        'NotificationSenderForClientTechnicalVisitTimeRequestActionService',
      useClass:
        NotificationSenderForClientTechnicalVisitTimeRequestActionService,
    },
  ],
})
export class NotificationSenderForClientTechnicalVisitTimeRequestActionModule {}
