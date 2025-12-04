import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECInventory,
  ECInventoryPrice,
  ECProduct,
  ECVendorAddress,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ProductProfile } from './mapper';
import { EntityAttributeValueModule } from '@rahino/eav/admin/entity-attribute-value/entity-attribute-value.module';
import { EntityModule } from '@rahino/eav/admin/entity/entity.module';
import { ProductPhotoModule } from '@rahino/ecommerce/admin/product-section/product-photo/product-photo.module';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { InventoryModule } from '@rahino/ecommerce/shared/inventory/inventory.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { BullModule } from '@nestjs/bullmq';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '@rahino/ecommerce/shared/inventory/constants';
import { ConfigService } from '@nestjs/config';
import { DBLoggerModule } from '@rahino/logger';
import { ProductVideoModule } from '@rahino/ecommerce/admin/product-section/product-video/product-video.module';
import { ECSlugVersion } from '@rahino/localdatabase/models';
import { PermissionModule } from '@rahino/core/user/permission/permission.module';
import { ProductQueryBuilderService } from './query-builder/product-query-builder.service';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { InventoryTrackChangeModule } from '@rahino/ecommerce/shared/inventory-track-change/inventory-track-change.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECProduct,
      ECInventory,
      ECInventoryPrice,
      ECVendorAddress,
      User,
      Permission,
      EAVEntityType,
      ECSlugVersion,
    ]),
    EntityAttributeValueModule,
    EntityModule,
    ProductPhotoModule,
    ProductVideoModule,
    InventoryModule,
    InventoryTrackChangeModule,
    UserVendorModule,
    QueryFilterModule,
    SequelizeModule,
    DBLoggerModule,
    PermissionModule,
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
    LocalizationModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductProfile, ProductQueryBuilderService],
  exports: [ProductService],
})
export class ProductModule {}
