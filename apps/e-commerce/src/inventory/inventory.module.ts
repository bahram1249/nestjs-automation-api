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
import { PRODUCT_INVENTORY_STATUS_QUEUE } from './constants';
import { DBLoggerModule } from '@rahino/logger';
import { ProductInventoryStatusProcessor } from './processor';

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
  ],
  providers: [
    InventoryValidationService,
    InventoryService,
    inventoryStatusService,
    InventoryProfile,
    ProductInventoryStatusProcessor,
  ],
  exports: [
    InventoryValidationService,
    InventoryService,
    inventoryStatusService,
  ],
})
export class InventoryModule {}
