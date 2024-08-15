import { Module } from '@nestjs/common';
import { CurrentPriceModule } from './admin/current-price/current-price.module';

@Module({
  imports: [CurrentPriceModule],
})
export class GoldModule {}
