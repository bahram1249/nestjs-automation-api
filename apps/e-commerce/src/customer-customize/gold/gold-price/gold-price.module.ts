import { Module } from '@nestjs/common';
import { GoldPriceService } from './gold-price.service';
import { GoldPriceController } from './gold-price.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Module({
  imports: [SequelizeModule.forFeature([Setting])],
  controllers: [GoldPriceController],
  providers: [GoldPriceService],
})
export class GoldPriceModule {}
