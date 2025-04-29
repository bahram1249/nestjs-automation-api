import { Module } from '@nestjs/common';
import { DiscountActionTypeController } from './discount-action-type.controller';
import { DiscountActionTypeService } from './discount-action-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountActionType } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECDiscountActionType])],
  controllers: [DiscountActionTypeController],
  providers: [DiscountActionTypeService],
})
export class DiscountActionTypeModule {}
