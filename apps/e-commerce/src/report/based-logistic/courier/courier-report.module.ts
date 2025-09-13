import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { BasedCourierReportController } from './courier-report.controller';
import { BasedCourierReportService } from './courier-report.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, PersianDate, ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail]),
  ],
  controllers: [BasedCourierReportController],
  providers: [BasedCourierReportService],
})
export class BasedCourierReportModule {}
