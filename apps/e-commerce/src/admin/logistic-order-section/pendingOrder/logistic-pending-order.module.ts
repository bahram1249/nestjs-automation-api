import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { LogisticEcommerceSmsModule } from '../../../client/shopping-section/based-logistic/sms/logistic-ecommerce-sms.module';
import { LogisticUtilOrderModule } from '../utilLogisticOrder/logistic-util-order.module';
import { LogisticPendingOrderController } from './logistic-pending-order.controller';
import { LogisticPendingOrderService } from './logistic-pending-order.service';
import { LocalizationModule } from 'apps/main/src/common/localization';

// NOTE: Controllers/Services for logistic pending orders are to be implemented separately.
// This module wires Sequelize models and utilities for logistic-based pending orders.
@Module({
  imports: [
    UserVendorModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
    ]),
    SequelizeModule,
    LogisticUtilOrderModule,
    LogisticEcommerceSmsModule,
    LocalizationModule,
  ],
  controllers: [LogisticPendingOrderController],
  providers: [LogisticPendingOrderService],
  exports: [],
})
export class LogisticPendingOrderModule {}
