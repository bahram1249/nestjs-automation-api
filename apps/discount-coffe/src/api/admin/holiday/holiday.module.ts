import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { HolidayService } from './holiday.service';
import { Buffet } from '@rahino/localdatabase/models';
import { HolidayController } from './holiday.controller';
import { BuffetIgnoreReserve } from '@rahino/localdatabase/models';
import { PersianDate } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      Buffet,
      BuffetIgnoreReserve,
      PersianDate,
    ]),
  ],
  providers: [HolidayService],
  controllers: [HolidayController],
})
export class HolidayApiModule {}
