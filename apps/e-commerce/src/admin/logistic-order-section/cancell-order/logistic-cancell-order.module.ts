import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECPayment,
  ECPaymentGateway,
  ECOrderStatus,
  ECOrderShipmentWay,
} from '@rahino/localdatabase/models';
import { LogisticUtilOrderModule } from '../utilLogisticOrder/logistic-util-order.module';
import { SnappayModule } from '@rahino/ecommerce/user/shopping/payment/provider/snappay.module';
import { RoleUtilModule } from '@rahino/core/user/role-util/role-util.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { FinalizedPaymentModule } from '@rahino/ecommerce/user/shopping/payment/util/finalized-payment/finalized-payment.module';
import { LogisticCancellOrderController } from './logistic-cancell-order.controller';
import { LogisticCancellOrderService } from './logistic-cancell-order.service';
import { LogisticUserRoleHandlerModule } from 'apps/e-commerce/src/admin/logistic-section/logistic-user-role-handler/logistic-user-role-handler.module';

// Logistic equivalent of CancellOrderModule for logistic-based orders
@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
      ECPayment,
      ECPaymentGateway,
      ECOrderStatus,
      ECOrderShipmentWay,
    ]),
    SequelizeModule,
    LogisticUtilOrderModule,
    SnappayModule,
    RoleUtilModule,
    UserVendorModule,
    FinalizedPaymentModule,
    LogisticUserRoleHandlerModule,
  ],
  controllers: [LogisticCancellOrderController],
  providers: [LogisticCancellOrderService],
  exports: [],
})
export class LogisticCancellOrderModule {}
