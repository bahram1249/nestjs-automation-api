import { Module } from '@nestjs/common';
import { DiscountConditionTypeController } from './discount-condition-type.controller';
import { DiscountConditionTypeService } from './discount-condition-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountConditionType } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECDiscountConditionType])],
  controllers: [DiscountConditionTypeController],
  providers: [DiscountConditionTypeService],
})
export class DiscountConditionTypeModule {}
