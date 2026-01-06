import { Module } from '@nestjs/common';
import { DiscountCodeUsageReportService } from './discount-code-usage-report.service';
import { DiscountCodeUsageReportController } from './discount-code-usage-report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import {
  GSDiscountCodeUsage,
  GSDiscountCode,
  GSFactor,
} from '@rahino/localdatabase/models/guarantee';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      GSDiscountCodeUsage,
      GSDiscountCode,
      GSFactor,
    ]),
    LocalizationModule,
  ],
  controllers: [DiscountCodeUsageReportController],
  providers: [DiscountCodeUsageReportService],
})
export class DiscountCodeUsageReportModule {}
