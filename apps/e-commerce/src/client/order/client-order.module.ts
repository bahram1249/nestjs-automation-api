import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { ClientOrderService } from './client-order.service';
import { ClientOrderController } from './client-order.controller';
import { LogisticUtilOrderModule } from '@rahino/ecommerce/client/order-section/utilLogisticOrder/logistic-util-order.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
    ]),
    LogisticUtilOrderModule,
  ],
  controllers: [ClientOrderController],
  providers: [ClientOrderService],
  exports: [ClientOrderService],
})
export class LogisticClientOrderModule {}
