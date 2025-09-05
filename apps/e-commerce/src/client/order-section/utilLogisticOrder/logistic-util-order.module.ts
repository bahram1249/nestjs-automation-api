import { Module } from '@nestjs/common';
import { LogisticOrderQueryBuilder } from './logistic-order-query-builder.service';
import { LogisticOrderUtilService } from './logistic-order-util.service';

@Module({
  providers: [LogisticOrderQueryBuilder, LogisticOrderUtilService],
  exports: [LogisticOrderQueryBuilder, LogisticOrderUtilService],
})
export class LogisticUtilOrderModule {}
