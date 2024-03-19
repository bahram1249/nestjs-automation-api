import { Module } from '@nestjs/common';
import { DiscountConditionTypeController } from './discount-condition-type.controller';
import { DiscountConditionTypeService } from './discount-condition-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountConditionType } from '@rahino/database/models/ecommerce-eav/ec-discount-condition-type.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECDiscountConditionType])],
  controllers: [DiscountConditionTypeController],
  providers: [DiscountConditionTypeService],
})
export class DiscountConditionModule {}
