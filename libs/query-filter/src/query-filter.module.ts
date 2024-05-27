import { Module } from '@nestjs/common';
import { listFilterFactory } from '@rahino/query-filter/provider';
import { ListFilterV2Factory } from './provider/list-filter-v2.factory';

@Module({
  providers: [listFilterFactory, ListFilterV2Factory],
  exports: [listFilterFactory, ListFilterV2Factory],
})
export class QueryFilterModule {}
