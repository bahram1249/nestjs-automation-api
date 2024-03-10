import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { HolidayService } from './holiday.service';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { HolidayController } from './holiday.controller';
import { BuffetIgnoreReserve } from '@rahino/database/models/discount-coffe/ignore-reserve.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';

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
