import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { StockProfile } from './mapper';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';
import { StockAvailabilityInventoryService } from './services';
import { StockInventoryProcessor } from './processor';
import { DBLoggerModule } from '@rahino/logger';
import { BullModule } from '@nestjs/bullmq';
import {
  STOCK_INVENTORY_QUEUE,
  STOCK_INVENTORY_REMOVE_QUEUE,
} from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { SessionModule } from '../session/session.module';
import { StockInventoryRemoveProcessor } from './processor/stock-inventory-remove.processor';

@Module({
  imports: [
    SequelizeModule.forFeature([User, ECStock]),
    SessionModule,
    QueryFilterModule,
    InventoryModule,
    ProductModule,
    DBLoggerModule,
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
      name: STOCK_INVENTORY_QUEUE,
    }),
    BullModule.registerQueueAsync({
      name: STOCK_INVENTORY_REMOVE_QUEUE,
    }),
  ],
  controllers: [StockController],
  providers: [
    StockService,
    StockAvailabilityInventoryService,
    StockProfile,
    StockInventoryProcessor,
    StockInventoryRemoveProcessor,
  ],
})
export class StockModule {}
