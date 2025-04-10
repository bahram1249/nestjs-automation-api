import { Module } from '@nestjs/common';
import { RialPriceService } from './rial-price.service';

@Module({
  providers: [RialPriceService],
  exports: [RialPriceService],
})
export class RialPriceModule {}
