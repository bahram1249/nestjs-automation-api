import { Module } from '@nestjs/common';
import { RewardHistoryReportService } from './reward-history-report.service';
import { RewardHistoryReportController } from './reward-history-report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import {
  GSRewardHistory,
  GSRewardRule,
  GSGuarantee,
  GSUnitPrice,
} from '@rahino/localdatabase/models/guarantee';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      GSRewardHistory,
      GSRewardRule,
      GSGuarantee,
      GSUnitPrice,
    ]),
    LocalizationModule,
  ],
  controllers: [RewardHistoryReportController],
  providers: [RewardHistoryReportService],
})
export class RewardHistoryReportModule {}
