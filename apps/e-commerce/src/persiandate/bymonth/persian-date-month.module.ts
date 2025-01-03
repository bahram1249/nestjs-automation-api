import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { PersianDate } from '@rahino/database';
import { PersianDateMonthController } from './persian-date-month.controller';
import { PersianDateMonthService } from './persian-date-month.service';

@Module({
  imports: [SequelizeModule.forFeature([User, PersianDate])],
  controllers: [PersianDateMonthController],
  providers: [PersianDateMonthService],
})
export class PersianDateMonthModule {}
