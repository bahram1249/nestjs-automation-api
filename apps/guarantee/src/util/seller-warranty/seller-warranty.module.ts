import { Module } from '@nestjs/common';
import { SellerWarrantyService } from './seller-warranty.service';
import { SellerTokenModule } from '../seller-token';

@Module({
  imports: [SellerTokenModule],
  providers: [SellerWarrantyService],
  exports: [SellerWarrantyService],
})
export class SellerWarrantyModule {}
