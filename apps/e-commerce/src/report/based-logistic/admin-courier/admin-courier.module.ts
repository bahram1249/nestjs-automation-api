import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { BasedAdminCourierController } from './admin-courier.controller';
import { BasedAdminCourierService } from './admin-courier.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, PersianDate, ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail]),
  ],
  controllers: [BasedAdminCourierController],
  providers: [BasedAdminCourierService],
})
export class BasedAdminCourierReportModule {}
