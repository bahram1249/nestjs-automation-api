import { Module } from '@nestjs/common';
import { DiscountConditionController } from './discount-condition.controller';
import { DiscountConditionService } from './discount-condition.service';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { DiscountConditionProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountCondition } from '@rahino/database/models/ecommerce-eav/ec-discount-condition.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { EntityTypeModule } from '@rahino/eav/admin/entity-type/entity-type.module';
import { ProductModule } from '../product/product.module';
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
