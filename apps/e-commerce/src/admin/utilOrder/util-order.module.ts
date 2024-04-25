import { Module } from '@nestjs/common';
import { OrderQueryBuilder } from './service/order-query-builder.service';

@Module({
  providers: [OrderQueryBuilder],
  exports: [OrderQueryBuilder],
})
export class UtilOrderModule {}
