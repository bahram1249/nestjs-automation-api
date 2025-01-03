import { Module } from '@nestjs/common';
import { CourierPriceService } from './courier-price.service';
import { CourierPriceController } from './courier-price.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { Setting } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Setting])],
  controllers: [CourierPriceController],
  providers: [CourierPriceService],
})
export class CourierPriceModule {}
