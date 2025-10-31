import { Module } from '@nestjs/common';
import { UserActionReportService } from './user-action-report.service';
import { UserActionReportController } from './user-action-report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import {
  BPMNRequest,
  BPMNRequestHistory,
  BPMNNode,
  BPMNActivity,
} from '@rahino/localdatabase/models/bpmn';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BPMNRequest,
      BPMNRequestHistory,
      BPMNNode,
      BPMNActivity,
    ]),
    LocalizationModule,
  ],
  controllers: [UserActionReportController],
  providers: [UserActionReportService],
})
export class UserActionReportModule {}
