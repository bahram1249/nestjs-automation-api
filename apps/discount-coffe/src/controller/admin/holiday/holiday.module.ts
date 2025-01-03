import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { PersianDate } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PersianDate])],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}
