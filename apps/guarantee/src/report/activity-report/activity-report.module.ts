import { Module } from '@nestjs/common';
import { ActivityReportController } from './activity-report.controller';
import { ActivityReportService } from './activity-report.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestHistory } from '@rahino/localdatabase/models/bpmn';
import { PermissionCheckerModule } from '@rahino/permission-checker';

@Module({
  imports: [
    SequelizeModule.forFeature([BPMNRequestHistory]),
    PermissionCheckerModule,
  ],
  controllers: [ActivityReportController],
  providers: [ActivityReportService],
})
export class ActivityReportModule {}
