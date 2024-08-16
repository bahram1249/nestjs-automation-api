import { Module } from '@nestjs/common';
import { CurrentPriceModule } from './admin/current-price/current-price.module';
import { PriceFormulaModule } from './admin/price-formula/price-formula.module';

@Module({
  imports: [CurrentPriceModule, PriceFormulaModule],
})
export class GoldModule {}
