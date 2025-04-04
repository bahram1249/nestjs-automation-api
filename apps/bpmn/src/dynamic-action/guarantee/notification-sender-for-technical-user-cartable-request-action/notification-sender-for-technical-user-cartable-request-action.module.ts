import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersianDate, User, UserRole } from '@rahino/database';
import { BPMNOrganizationUser, GSRequest } from '@rahino/localdatabase/models';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationSenderForTechnicalUserCartableRequestActionService } from './notification-sender-for-technical-user-cartable-request-action.service';
import { TECHNICAL_USER_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/technical-user-cartable-request-sms-sender/constants';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserRole,
      BPMNOrganizationUser,
      User,
      GSRequest,
      PersianDate,
    ]),
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
      name: TECHNICAL_USER_CARTABLE_REQUEST_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForTechnicalUserCartableRequestActionService',
      useClass: NotificationSenderForTechnicalUserCartableRequestActionService,
    },
  ],
})
export class NotificationSenderForTechnicalUserCartableRquestActionModule {}
