import { Module } from '@nestjs/common';
import { OrderQueryBuilder } from './service/order-query-builder.service';
import { OrderUtilService } from './service/order-util.service';

@Module({
  providers: [OrderQueryBuilder, OrderUtilService],
  exports: [OrderQueryBuilder, OrderUtilService],
})
export class UtilOrderModule {}
