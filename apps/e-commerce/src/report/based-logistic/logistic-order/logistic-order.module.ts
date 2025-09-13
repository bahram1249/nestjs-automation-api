import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { LogisticOrderController } from './logistic-order.controller';
import { LogisticOrderService } from './logistic-order.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, PersianDate, ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail]),
  ],
  controllers: [LogisticOrderController],
  providers: [LogisticOrderService],
})
export class LogisticOrderReportModule {}
