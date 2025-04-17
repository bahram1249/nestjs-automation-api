import { Module } from '@nestjs/common';
import { GSFactorDeatilAndRemainingAmountService } from './factor-detail-and-amount-remaining.service';
import { GsFactorDetailAndReaminingAmountController } from './factor-detail-and-amount-remaining.controller';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';

@Module({
  imports: [GSSharedFactorDetailAndRemainingAmountModule, RialPriceModule],
  controllers: [GsFactorDetailAndReaminingAmountController],
  providers: [GSFactorDeatilAndRemainingAmountService],
  exports: [GSFactorDeatilAndRemainingAmountService],
})
export class GSClientFactorDetailAndRemainingAmountModule {}
