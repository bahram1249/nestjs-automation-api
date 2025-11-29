import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ECLogisticOrder, ECLogisticOrderGrouped]),
  ],
  providers: [LogisticOrderQueryBuilder, LogisticOrderUtilService],
  exports: [LogisticOrderQueryBuilder, LogisticOrderUtilService],
})
export class LogisticUtilOrderModule {}
