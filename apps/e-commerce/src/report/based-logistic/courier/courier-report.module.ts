import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { ECLogisticOrderGrouped, User } from '@rahino/localdatabase/models';
import { BasedCourierReportController } from './courier-report.controller';
import { BasedCourierReportService } from './courier-report.service';
import { LogisticOrderQueryBuilderModule } from '../order-query-builder/logistic-order-query-builder.module';

@Module({
  imports: [
    LogisticOrderQueryBuilderModule,
    SequelizeModule.forFeature([PersianDate, ECLogisticOrderGrouped, User]),
  ],
  controllers: [BasedCourierReportController],
  providers: [BasedCourierReportService],
})
export class BasedCourierReportModule {}
