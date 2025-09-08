import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECOrderStatus,
  ECLogisticShipmentWay,
  ECPayment,
  ECPaymentGateway,
} from '@rahino/localdatabase/models';
import { RoleUtilModule } from '@rahino/core/user/role-util/role-util.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { LogisticUtilOrderModule } from '../utilLogisticOrder/logistic-util-order.module';
import { LogisticTotalOrderController } from './logistic-total-order.controller';
import { LogisticTotalOrderService } from './logistic-total-order.service';
import { LogisticFinalizedPaymentModule } from '../../../client/shopping-section/based-logistic/payment/util/finalized-payment/logistic-finalized-payment.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { LogisticSnappayModule } from '../../../client/shopping-section/based-logistic/payment/provider/snappay.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
      ECOrderStatus,
      ECLogisticShipmentWay,
      ECPayment,
      ECPaymentGateway,
    ]),
    RoleUtilModule,
    UserVendorModule,
    LogisticUtilOrderModule,
    LogisticFinalizedPaymentModule,
    LogisticSnappayModule,
    LocalizationModule,
    SequelizeModule,
  ],
  controllers: [LogisticTotalOrderController],
  providers: [LogisticTotalOrderService],
})
export class LogisticTotalOrderModule {}
