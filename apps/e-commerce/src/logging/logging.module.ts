import { Module } from '@nestjs/common';
import { LoggingService } from './service';
import { LoggingProcessor } from './processor';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REQUEST_LOGGING_QUEUE } from './constants';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECRequestLog } from '@rahino/localdatabase/models';

@Module({
  imports: [
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
      name: REQUEST_LOGGING_QUEUE,
    }),
    SequelizeModule.forFeature([ECRequestLog]),
  ],
  providers: [LoggingService, LoggingProcessor],
  exports: [LoggingService],
})
export class LoggingModule {}
