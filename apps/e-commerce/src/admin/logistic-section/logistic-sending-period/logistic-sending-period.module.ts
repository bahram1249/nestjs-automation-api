import { Module } from '@nestjs/common';
import { LogisticSendingPeriodController } from './logistic-sending-period.controller';
import { LogisticSendingPeriodService } from './logistic-sending-period.service';
import { LogisticSendingPeriodProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECLogisticSendingPeriod } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECLogisticSendingPeriod]),
    LocalizationModule,
  ],
  controllers: [LogisticSendingPeriodController],
  providers: [LogisticSendingPeriodService, LogisticSendingPeriodProfile],
})
export class AdminLogisticSendingPeriodModule {}
