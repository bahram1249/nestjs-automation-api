import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { LogisticUtilOrderModule } from '../utilLogisticOrder/logistic-util-order.module';
import { LogisticEcommerceSmsModule } from '../../../client/shopping-section/based-logistic/sms/logistic-ecommerce-sms.module';
import { LogisticPostageOrderController } from './logistic-postage-order.controller';
import { LogisticPostageOrderService } from './logistic-postage-order.service';
import { LogisticUserRoleHandlerModule } from '../../logistic-section/logistic-user-role-handler/logistic-user-role-handler.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

// Logistic equivalent of PostageOrderModule for logistic-based orders
@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
    ]),
    SequelizeModule,
    LogisticUtilOrderModule,
    LogisticEcommerceSmsModule,
    LogisticUserRoleHandlerModule,
    LocalizationModule,
  ],
  controllers: [LogisticPostageOrderController],
  providers: [LogisticPostageOrderService],
  exports: [],
})
export class LogisticPostageOrderModule {}
