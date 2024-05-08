import { Module } from '@nestjs/common';
import { CourierPriceService } from './courier-price.service';
import { CourierPriceController } from './courier-price.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Setting])],
  controllers: [CourierPriceController],
  providers: [CourierPriceService],
})
export class CourierPriceModule {}
