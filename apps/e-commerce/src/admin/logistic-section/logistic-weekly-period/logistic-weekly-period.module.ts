import { Module } from '@nestjs/common';
import { LogisticWeeklyPeriodController } from './logistic-weekly-period.controller';
import { LogisticWeeklyPeriodService } from './logistic-weekly-period.service';
import { LogisticWeeklyPeriodProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECLogisticSendingPeriod,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticSendingPeriod,
      ECLogisticWeeklyPeriod,
      ECLogisticWeeklyPeriodTime,
    ]),
    SequelizeModule,
    LocalizationModule,
  ],
  controllers: [LogisticWeeklyPeriodController],
  providers: [LogisticWeeklyPeriodService, LogisticWeeklyPeriodProfile],
})
export class AdminLogisticWeeklyPeriodModule {}
