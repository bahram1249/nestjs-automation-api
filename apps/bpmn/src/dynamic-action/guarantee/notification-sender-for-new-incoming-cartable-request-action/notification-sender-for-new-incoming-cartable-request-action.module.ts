import { Module } from '@nestjs/common';
import { NotificationSenderForNewIncomingCartableRequestActionService } from './notification-sender-for-new-incoming-cartable-request-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UserRole } from '@rahino/database';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { NEW_INCOMING_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/new-incoming-cartable-request-sms-sender/constants';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([UserRole, BPMNOrganizationUser, User]),
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
      name: NEW_INCOMING_CARTABLE_REQUEST_SMS_SENDER_QUEUE,
    }),
  ],
  providers: [
    {
      provide: 'NotificationSenderForNewIncomingCartableRequestActionService',
      useClass: NotificationSenderForNewIncomingCartableRequestActionService,
    },
  ],
})
export class NotificationSenderForNewIncomingCartableRequestActionModule {}
