import { Module } from '@nestjs/common';
import { SaleQueryBuilderService } from './sale-query-builder.service';

@Module({
  providers: [SaleQueryBuilderService],
  exports: [SaleQueryBuilderService],
})
export class SaleQueryBuilderModule {}
