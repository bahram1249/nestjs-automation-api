import { Module } from '@nestjs/common';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { VendorAddressModule } from '@rahino/ecommerce/vendor-address/vendor-address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVariationPrice } from '@rahino/database';
import { ECColor } from '@rahino/database';
import { ECGuarantee } from '@rahino/database';
import { ECGuaranteeMonth } from '@rahino/database';
import { InventoryProfile } from './mapper';
import {
  DecreaseInventoryService,
  InventoryService,
  InventoryValidationService,
  inventoryStatusService,
} from './services';
import { ECInventory } from '@rahino/database';
import { ECInventoryPrice } from '@rahino/database';
import { ECProvince } from '@rahino/database';
import { QueryFilterModule } from '@rahino/query-filter';
import { ECProduct } from '@rahino/database';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DECREASE_INVENTORY_QUEUE,
  PRODUCT_INVENTORY_STATUS_QUEUE,
  REVERT_INVENTORY_QTY_QUEUE,
} from './constants';
import { DBLoggerModule } from '@rahino/logger';
import {
  DecreaseInventoryProcessor,
  ProductInventoryStatusProcessor,
} from './processor';
import { ECPayment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { RevertInventoryQtyProcessor } from './processor/revert-inventory-qty.processor';
import { PaymentServiceProviderModule } from '../user/payment/provider/payment-provider.module';
import { InventoryTrackChangeModule } from '../inventory-track-change/inventory-track-change.module';
import { ECWallet } from '@rahino/database';
import { RevertPaymentQtyModule } from './revert-payment-qty.module';
import { CalPriceFactoryModule } from '../admin/product/price-cal-factory/cal-price-factory.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECInventory,
      ECInventoryPrice,
      ECVariationPrice,
      ECColor,
      ECGuarantee,
      ECGuaranteeMonth,
      ECProvince,
      ECProduct,
      ECPayment,
      ECOrder,
      ECWallet,
    ]),
    UserVendorModule,
    VendorAddressModule,
    QueryFilterModule,
    DBLoggerModule,
    InventoryTrackChangeModule,
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
      name: PRODUCT_INVENTORY_STATUS_QUEUE,
    }),
    BullModule.registerQueueAsync({
      name: DECREASE_INVENTORY_QUEUE,
    }),
    BullModule.registerQueue({
      name: REVERT_INVENTORY_QTY_QUEUE,
    }),
    PaymentServiceProviderModule,
    RevertPaymentQtyModule,
    CalPriceFactoryModule,
  ],
  providers: [
    InventoryValidationService,
    InventoryService,
    inventoryStatusService,
    InventoryProfile,
    ProductInventoryStatusProcessor,
    DecreaseInventoryService,
    DecreaseInventoryProcessor,
    RevertInventoryQtyProcessor,
  ],
  exports: [
    InventoryValidationService,
    InventoryService,
    inventoryStatusService,
    DecreaseInventoryService,
  ],
})
export class InventoryModule {}
