import { Module } from '@nestjs/common';
import { listFilterFactory } from '@rahino/query-filter/provider';

@Module({
  providers: [listFilterFactory],
  exports: [listFilterFactory],
})
export class QueryFilterModule {}
