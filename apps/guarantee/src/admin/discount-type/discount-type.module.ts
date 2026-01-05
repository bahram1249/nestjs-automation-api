import { Module } from '@nestjs/common';
import { DiscountTypeService } from './discount-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSDiscountType } from '@rahino/localdatabase/models';
import { DiscountTypeController } from './discount-type.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule.forFeature([GSDiscountType]), LocalizationModule],
  controllers: [DiscountTypeController],
  providers: [DiscountTypeService],
  exports: [DiscountTypeService],
})
export class GSDiscountTypeModule {}
