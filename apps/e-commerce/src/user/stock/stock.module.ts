import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { StockProfile } from './mapper';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';
import { StockAvailabilityInventoryService } from './services';
import {
  StockInventoryProcessor,
  StockInventoryRemoveProcessor,
  StockInventoryUpdateProcessor,
} from './processor';
import { DBLoggerModule } from '@rahino/logger';
import { BullModule } from '@nestjs/bullmq';
import {
  STOCK_INVENTORY_QUEUE,
  STOCK_INVENTORY_REMOVE_QUEUE,
  STOCK_INVENTORY_UPDATE_QUEUE,
} from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { SessionModule } from '../session/session.module';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { AddressModule } from '../address/address.module';
import { StockPriceService } from './services/price';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ShipmentModule } from './services/shipment-price';
import { PaymentServiceProviderModule } from '../payment/provider/payment-provider.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      ECStock,
      ECPaymentGateway,
      ECVariationPrice,
      ECProvince,
    ]),
    ShipmentModule.register({ token: 'SHIPMENT_SERVICE' }),
    AddressModule,
    SessionModule,
    QueryFilterModule,
    InventoryModule,
    ProductModule,
    DBLoggerModule,
    PaymentServiceProviderModule,
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
    BullModule.registerQueueAsync({
      name: STOCK_INVENTORY_UPDATE_QUEUE,
    }),
  ],
  controllers: [StockController],
  providers: [
    StockService,
    StockAvailabilityInventoryService,
    StockProfile,
    StockInventoryProcessor,
    StockInventoryRemoveProcessor,
    StockInventoryUpdateProcessor,
    StockPriceService,
  ],
  exports: [StockService, StockPriceService],
})
export class StockModule {}
