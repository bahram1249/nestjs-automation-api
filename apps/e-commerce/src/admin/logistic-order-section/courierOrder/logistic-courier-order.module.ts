import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import {
  ECLogisticOrder,
  ECCourier,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { LogisticUtilOrderModule } from '../utilLogisticOrder/logistic-util-order.module';
import { LogisticEcommerceSmsModule } from '../../../client/shopping-section/based-logistic/sms/logistic-ecommerce-sms.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { LogisticCourierOrderController } from './logistic-courier-order.controller';
import { LogisticCourierOrderService } from './logistic-courier-order.service';
import { LogisticUserRoleHandlerModule } from '../../logistic-section/logistic-user-role-handler/logistic-user-role-handler.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

// Logistic equivalent of CourierOrderModule for logistic-based orders
@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECCourier,
    ]),
    SequelizeModule,
    LogisticUtilOrderModule,
    LogisticEcommerceSmsModule,
    UserVendorModule,
    LogisticUserRoleHandlerModule,
    LocalizationModule,
  ],
  controllers: [LogisticCourierOrderController],
  providers: [LogisticCourierOrderService],
  exports: [],
})
export class LogisticCourierOrderModule {}
