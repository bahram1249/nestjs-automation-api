import { Module } from '@nestjs/common';
import { DiscountConditionController } from './discount-condition.controller';
import { DiscountConditionService } from './discount-condition.service';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { DiscountConditionProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountCondition } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { EntityTypeModule } from '@rahino/eav/admin/entity-type/entity-type.module';
import { ProductModule } from '../../product-section/product/product.module';
import { UserInventoryModule } from '@rahino/ecommerce/user/inventory/user-inventory.module';

@Module({
  imports: [
    UserVendorModule,
    EntityTypeModule,
    ProductModule,
    UserInventoryModule,
    SequelizeModule.forFeature([User, Permission, ECDiscountCondition]),
  ],
  controllers: [DiscountConditionController],
  providers: [DiscountConditionService, DiscountConditionProfile],
})
export class DiscountConditionModule {}
