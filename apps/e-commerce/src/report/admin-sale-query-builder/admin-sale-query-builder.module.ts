import { Module } from '@nestjs/common';
import { AdminSaleQueryBuilderService } from './admin-sale-query-builder.service';

@Module({
  providers: [AdminSaleQueryBuilderService],
  exports: [AdminSaleQueryBuilderService],
})
export class AdminSaleQueryBuilderModule {}
