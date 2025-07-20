import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { ProductModule } from '@rahino/ecommerce/client/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { StockProfile } from './mapper';
import { InventoryModule } from '@rahino/ecommerce/shared/inventory/inventory.module';
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
import { User } from '@rahino/database';
import { ECStock } from '@rahino/localdatabase/models';
import { SessionModule } from '../../session/session.module';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { AddressModule } from '../../address/address.module';
import { StockPriceService } from './services/price';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { ECProvince } from '@rahino/localdatabase/models';
import { ShipmentModule } from './services/shipment-price';
import { PaymentServiceProviderModule } from '../payment/provider/payment-provider.module';
import { PaymentRuleModule } from '../payment-rule/payment-rule.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { ApplyDiscountModule } from '@rahino/ecommerce/shared/apply-discount';

@Module({
  imports: [
    LocalizationModule,
    PaymentRuleModule,
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
    ApplyDiscountModule,
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
