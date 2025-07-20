import { Module } from '@nestjs/common';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { VendorAddressModule } from '@rahino/ecommerce/vendor-address/vendor-address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { ECColor } from '@rahino/localdatabase/models';
import { ECGuarantee } from '@rahino/localdatabase/models';
import { ECGuaranteeMonth } from '@rahino/localdatabase/models';
import { InventoryProfile } from './mapper';
import {
  DecreaseInventoryService,
  InventoryService,
  InventoryValidationService,
  inventoryStatusService,
} from './services';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { ECProvince } from '@rahino/localdatabase/models';
import { QueryFilterModule } from '@rahino/query-filter';
import { ECProduct } from '@rahino/localdatabase/models';
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
import { ECPayment } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { RevertInventoryQtyProcessor } from './processor/revert-inventory-qty.processor';
import { PaymentServiceProviderModule } from '../../user/shopping/payment/provider/payment-provider.module';
import { InventoryTrackChangeModule } from '../inventory-track-change/inventory-track-change.module';
import { ECWallet } from '@rahino/localdatabase/models';
import { RevertPaymentQtyModule } from './revert-payment-qty.module';
import { CalPriceFactoryModule } from '../../admin/product-section/product/price-cal-factory/cal-price-factory.module';

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
