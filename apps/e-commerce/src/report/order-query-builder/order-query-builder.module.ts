import { Module } from '@nestjs/common';
import { OrderQueryBuilderService } from './order-query-builder.service';

@Module({
  providers: [OrderQueryBuilderService],
  exports: [OrderQueryBuilderService],
})
export class OrderQueryBuilderModule {}
