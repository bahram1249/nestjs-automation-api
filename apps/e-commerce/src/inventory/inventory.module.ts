import { Module } from '@nestjs/common';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { VendorAddressModule } from '@rahino/ecommerce/vendor-address/vendor-address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { InventoryProfile } from './mapper';
import {
  DecreaseInventoryService,
  InventoryService,
  InventoryValidationService,
  inventoryStatusService,
} from './services';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { QueryFilterModule } from '@rahino/query-filter';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
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
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { RevertInventoryQtyProcessor } from './processor/revert-inventory-qty.processor';
import { PaymentServiceProviderModule } from '../user/payment/provider/payment-provider.module';
import { RevertInventoryModule } from './revert-inventory.module';

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
    ]),
    UserVendorModule,
    VendorAddressModule,
    QueryFilterModule,
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
      name: PRODUCT_INVENTORY_STATUS_QUEUE,
    }),
    BullModule.registerQueueAsync({
      name: DECREASE_INVENTORY_QUEUE,
    }),
    BullModule.registerQueue({
      name: REVERT_INVENTORY_QTY_QUEUE,
    }),
    PaymentServiceProviderModule,
    RevertInventoryModule,
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
