import { Module } from '@nestjs/common';
import { IncomeReportService } from './income-report.service';
import { IncomeReportController } from './income-report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { GSFactor } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, GSFactor]),
    LocalizationModule,
  ],
  controllers: [IncomeReportController],
  providers: [IncomeReportService],
})
export class IncomeReportModule {}
