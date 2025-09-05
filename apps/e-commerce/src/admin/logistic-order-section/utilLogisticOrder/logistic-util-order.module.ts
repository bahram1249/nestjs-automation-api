import { Module } from '@nestjs/common';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';

@Module({
  providers: [LogisticOrderQueryBuilder, LogisticOrderUtilService],
  exports: [LogisticOrderQueryBuilder, LogisticOrderUtilService],
})
export class LogisticUtilOrderModule {}
