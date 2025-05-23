import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PreRegistrationRejectSmsSenderProcessor } from './processor';
import { SmsSenderModule } from '@rahino/guarantee/shared/sms-sender';
import { PRE_REGISTRATION_REJECT_SMS_SENDER_QUEUE } from './constants';

@Module({
  imports: [
    SmsSenderModule,
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
      name: PRE_REGISTRATION_REJECT_SMS_SENDER_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  providers: [PreRegistrationRejectSmsSenderProcessor],
})
export class PreRegistrationRejectDescriptionSmsSenderModule {}
