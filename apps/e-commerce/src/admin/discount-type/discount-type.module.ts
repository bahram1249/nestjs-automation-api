import { Module } from '@nestjs/common';
import { DiscountTypeController } from './discount-type.controller';
import { DiscountTypeService } from './discount-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountType } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECDiscountType])],
  controllers: [DiscountTypeController],
  providers: [DiscountTypeService],
})
export class DiscountTypeModule {}
