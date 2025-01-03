import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';
import {
  RetrievePricePersianApiService,
  RetrievePriceRunnerService,
} from './services';
import { QueryFilterModule } from '@rahino/query-filter';
import { ECInventory } from '@rahino/database';
import { CalPriceFactoryModule } from '@rahino/ecommerce/admin/product/price-cal-factory/cal-price-factory.module';
import { ECInventoryPrice } from '@rahino/database';
import { RetrievePriceProcessor } from './processor';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RETRIEVE_PRICE_QUEUE } from './constants';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '@rahino/ecommerce/inventory/constants';
import { DBLoggerModule } from '@rahino/logger';

@Module({
  imports: [
    SequelizeModule.forFeature([Setting, ECInventory, ECInventoryPrice]),
    QueryFilterModule,
    CalPriceFactoryModule,
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
      name: RETRIEVE_PRICE_QUEUE,
    }),
    BullModule.registerQueueAsync({
      name: PRODUCT_INVENTORY_STATUS_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    DBLoggerModule,
  ],
  providers: [
    RetrievePricePersianApiService,
    RetrievePriceRunnerService,
    RetrievePriceProcessor,
  ],
})
export class RetrievePriceJobModule {}
