import { Module } from '@nestjs/common';
import { CurrentPriceModule } from './admin/current-price/current-price.module';
import { PriceFormulaModule } from './admin/price-formula/price-formula.module';
import { RetrievePriceJobModule } from './retrieve-price-job/retrieve-price-job.module';

@Module({
  imports: [CurrentPriceModule, PriceFormulaModule, RetrievePriceJobModule],
})
export class GoldModule {}
