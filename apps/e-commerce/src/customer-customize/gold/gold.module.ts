import { Module } from '@nestjs/common';
import { CurrentPriceModule } from './admin/current-price/current-price.module';
import { PriceFormulaModule } from './admin/price-formula/price-formula.module';
import { RetrievePriceJobModule } from './retrieve-price-job/retrieve-price-job.module';
import { GoldPriceModule } from './gold-price/gold-price.module';

@Module({
  imports: [
    CurrentPriceModule,
    PriceFormulaModule,
    GoldPriceModule,
    RetrievePriceJobModule,
  ],
})
export class GoldModule {}
