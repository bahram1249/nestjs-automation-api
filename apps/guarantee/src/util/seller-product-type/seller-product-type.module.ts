import { Module } from '@nestjs/common';
import { SellerProductTypeService } from './seller-product-type.service';
import { SellerTokenModule } from '../seller-token';

@Module({
  imports: [SellerTokenModule],
  providers: [SellerProductTypeService],
  exports: [SellerProductTypeService],
})
export class SellerProductTypeModule {}
