import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECHomePage } from '@rahino/localdatabase/models';
import { HomePageValidatorService } from './home-page-validator.service';
import { Attachment } from '@rahino/database';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ECEntityTypeSort } from '@rahino/localdatabase/models';
import { ECBrand } from '@rahino/localdatabase/models';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HOME_PAGE_QUEUE } from '@rahino/ecommerce/client/home/constants';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECHomePage,
      Attachment,
      EAVEntityType,
      ECEntityTypeSort,
      ECBrand,
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
  ],
  controllers: [HomePageController],
  providers: [HomePageService, HomePageValidatorService],
})
export class AdminHomePageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
