import { Module } from '@nestjs/common';
import { LogisticSaleQueryBuilderService } from './logistic-sale-query-builder.service';

@Module({
  providers: [LogisticSaleQueryBuilderService],
  exports: [LogisticSaleQueryBuilderService],
})
export class LogisticSaleQueryBuilderModule {}
