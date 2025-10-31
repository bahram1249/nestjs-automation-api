import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrderGrouped } from '@rahino/localdatabase/models';
import { BasedAdminCourierController } from './admin-courier.controller';
import { BasedAdminCourierService } from './admin-courier.service';
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
  controllers: [BasedAdminCourierController],
  providers: [BasedAdminCourierService],
})
export class BasedAdminCourierReportModule {}
