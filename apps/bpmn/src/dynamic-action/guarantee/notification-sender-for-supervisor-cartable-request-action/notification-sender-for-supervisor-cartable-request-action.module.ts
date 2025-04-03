import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersianDate, User, UserRole } from '@rahino/database';
import { BPMNOrganizationUser, GSRequest } from '@rahino/localdatabase/models';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationSenderForSupervisorCartableRquestActionService } from './notification-sender-for-supervisor-cartable-request-action.service';
import { SUPERVISOR_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/supervisor-cartable-request-sms-sender/constants';

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
      name: SUPERVISOR_CARTABLE_REQUEST_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForSupervisorCartableRquestActionService',
      useClass: NotificationSenderForSupervisorCartableRquestActionService,
    },
  ],
})
export class NotificationSenderForSupervisorCartableRquestActionModule {}
