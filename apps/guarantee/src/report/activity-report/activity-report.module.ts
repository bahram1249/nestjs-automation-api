import { Module } from '@nestjs/common';
import { ActivityReportController } from './activity-report.controller';
import { ActivityReportService } from './activity-report.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestHistory } from '@rahino/localdatabase/models/bpmn';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([BPMNRequestHistory, User, Permission])],
  controllers: [ActivityReportController],
  providers: [ActivityReportService],
})
export class ActivityReportModule {}
