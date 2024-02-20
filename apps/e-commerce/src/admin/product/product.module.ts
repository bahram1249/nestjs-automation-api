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
import { DatabaseModule } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([ECProduct, User, Permission, EAVEntityType]),
    EntityAttributeValueModule,
    EntityModule,
    ProductPhotoModule,
    InventoryModule,
    UserVendorModule,
    QueryFilterModule,
    SequelizeModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductProfile],
})
export class ProductModule {}
