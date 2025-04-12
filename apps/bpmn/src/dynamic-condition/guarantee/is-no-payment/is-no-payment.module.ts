import { Module } from '@nestjs/common';
import { IsNoPaymentService } from './is-no-payment.service';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Module({
  imports: [GSSharedFactorDetailAndRemainingAmountModule],
  providers: [
    {
      provide: 'IsNoPaymentService',
      useClass: IsNoPaymentService,
    },
  ],
})
export class IsNoPaymentModule {}
