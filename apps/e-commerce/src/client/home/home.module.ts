import { Module } from '@nestjs/common';
import { HomePageController } from './home.controller';
import { HomePageService } from './home.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionModule } from '../../user/session/session.module';
import { ECHomePage } from '@rahino/localdatabase/models';
import { ProcessHomeService } from './process-home.service';
import { ECEntityTypeSort } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ECBrand } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { HomePageProcessor } from './processor';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HOME_PAGE_QUEUE } from './constants';
import { ProcessHomeRunnerService } from './process-home-runner.service';
import { RedisClientModule } from '@rahino/redis-client';
import { ProcessHomeByLatLonService } from './process-home-by-lat-lon.service';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([
      ECHomePage,
      ECEntityTypeSort,
      EAVEntityType,
      ECBrand,
      Attachment,
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
      name: HOME_PAGE_QUEUE,
    }),
    RedisClientModule,
  ],
  controllers: [HomePageController],
  providers: [
    HomePageService,
    ProcessHomeService,
    HomePageProcessor,
    ProcessHomeRunnerService,
    ProcessHomeByLatLonService,
  ],
})
export class HomePageModule {}
