import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscount } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECDiscountType } from '@rahino/localdatabase/models';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { ECDiscountCondition } from '@rahino/localdatabase/models';
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
