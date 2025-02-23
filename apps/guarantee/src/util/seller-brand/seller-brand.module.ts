import { Module } from '@nestjs/common';
import { SellerBrandService } from './seller-brand.service';
import { SellerTokenModule } from '../seller-token';

@Module({
  imports: [SellerTokenModule],
  providers: [SellerBrandService],
  exports: [SellerBrandService],
})
export class SellerBrandModule {}
