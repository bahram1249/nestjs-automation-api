import { Module } from '@nestjs/common';
import { SellerProductTypeService } from './seller-product-type.service';

@Module({
  imports: [SellerProductTypeModule],
  providers: [SellerProductTypeService],
  exports: [SellerProductTypeService],
})
export class SellerProductTypeModule {}
