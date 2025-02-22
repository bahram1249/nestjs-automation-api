import { Module } from '@nestjs/common';
import { SellerTokenService } from './seller-token.service';

@Module({
  providers: [SellerTokenService],
  exports: [SellerTokenService],
})
export class SellerTokenModule {}
