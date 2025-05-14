import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationSenderForClientTechnicalStateRequestActionService } from './notification-sender-for-client-technical-state-request-action.service';
import { CLIENT_TECHNICAL_STATE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-technical-state-request-sms-sender/constants';

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
      name: CLIENT_TECHNICAL_STATE_REQUEST_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForClientTechnicalStateRequestActionService',
      useClass: NotificationSenderForClientTechnicalStateRequestActionService,
    },
  ],
})
export class NotificationSenderForClientTechnicalStateRequestActionModule {}
