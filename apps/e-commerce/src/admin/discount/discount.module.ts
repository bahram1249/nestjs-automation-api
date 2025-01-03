import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscount } from '@rahino/database';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECDiscountType } from '@rahino/database';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { ECDiscountCondition } from '@rahino/database';
import { PermissionModule } from '@rahino/core/user/permission/permission.module';

@Module({
  imports: [
    UserVendorModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      ECDiscount,
      ECDiscountType,
      ECDiscountCondition,
    ]),
    SequelizeModule,
    PermissionModule,
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountProfile],
})
export class DiscountModule {}
