import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ProductProfile } from './mapper';
import { EntityAttributeValueModule } from '@rahino/eav/admin/entity-attribute-value/entity-attribute-value.module';
import { EntityModule } from '@rahino/eav/admin/entity/entity.module';
import { ProductPhotoModule } from '@rahino/ecommerce/product-photo/product-photo.module';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { BullModule } from '@nestjs/bullmq';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '@rahino/ecommerce/inventory/constants';
import { ConfigService } from '@nestjs/config';
import { DBLoggerModule } from '@rahino/logger';
import { ProductVideoModule } from '@rahino/ecommerce/product-video/product-video.module';
import { ECSlugVersion } from '@rahino/database/models/ecommerce-eav/ec-slug-version.entity';
import { PermissionModule } from '@rahino/core/user/permission/permission.module';
import { CalPriceFactoryModule } from './price-cal-factory/cal-price-factory.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECProduct,
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
    CalPriceFactoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductProfile],
  exports: [ProductService],
})
export class ProductModule {}
