import { Module } from '@nestjs/common';
import { SellerVariantService } from './seller-variant.service';
import { SellerTokenModule } from '../seller-token';

@Module({
  imports: [SellerTokenModule],
  providers: [SellerVariantService],
  exports: [SellerVariantService],
})
export class SellerVaraintModule {}
