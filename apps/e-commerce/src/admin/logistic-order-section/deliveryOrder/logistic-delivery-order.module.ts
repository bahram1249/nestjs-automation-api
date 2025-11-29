import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import {
  ECLogisticOrder,
  ECCourier,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { LogisticUtilOrderModule } from '../utilLogisticOrder/logistic-util-order.module';
import { RoleUtilModule } from '@rahino/core/user/role-util/role-util.module';
import { LogisticDeliveryOrderController } from './logistic-delivery-order.controller';
import { LogisticDeliveryOrderService } from './logistic-delivery-order.service';

// Logistic equivalent of DeliveryOrderModule for logistic-based orders
@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECCourier,
    ]),
    RoleUtilModule,
    LogisticUtilOrderModule,
  ],
  controllers: [LogisticDeliveryOrderController],
  providers: [LogisticDeliveryOrderService],
  exports: [],
})
export class LogisticDeliveryOrderModule {}
