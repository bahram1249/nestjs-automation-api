import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECDiscountType } from '@rahino/database/models/ecommerce-eav/ec-discount-type.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECDiscount, ECDiscountType]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountProfile],
})
export class DiscountModule {}
