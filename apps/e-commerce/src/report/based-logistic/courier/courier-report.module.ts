import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrderGrouped } from '@rahino/localdatabase/models';
import { BasedCourierReportController } from './courier-report.controller';
import { BasedCourierReportService } from './courier-report.service';
import { LogisticOrderQueryBuilderModule } from '../order-query-builder/logistic-order-query-builder.module';

@Module({
  imports: [
    LogisticOrderQueryBuilderModule,
    SequelizeModule.forFeature([
      PersianDate,
      ECLogisticOrderGrouped,
      User,
      Permission,
    ]),
  ],
  controllers: [BasedCourierReportController],
  providers: [BasedCourierReportService],
})
export class BasedCourierReportModule {}
