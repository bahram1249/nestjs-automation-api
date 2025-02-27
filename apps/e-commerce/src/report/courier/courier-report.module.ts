import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { CourierReportController } from './courier-report.controller';
import { OrderQueryBuilderModule } from '../order-query-builder/order-query-builder.module';
import { CourierReportService } from './courier-report.service';
import { PersianDate } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, PersianDate]),
    OrderQueryBuilderModule,
  ],
  controllers: [CourierReportController],
  providers: [CourierReportService],
})
export class CourierReportModule {}
