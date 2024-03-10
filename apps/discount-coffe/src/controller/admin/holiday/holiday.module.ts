import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PersianDate])],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}
