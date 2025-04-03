import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperVisorCartableSmsSenderProcessor } from './processor';
import { SmsSenderModule } from '@rahino/guarantee/shared/sms-sender';
import { SUPERVISOR_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from './constants';

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
      name: SUPERVISOR_CARTABLE_REQUEST_SMS_SENDER_QUEUE,
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
  providers: [SuperVisorCartableSmsSenderProcessor],
})
export class SuperVisorCartableRequestSmsSenderModule {}
