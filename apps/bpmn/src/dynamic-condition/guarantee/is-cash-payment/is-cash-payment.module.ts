import { Module } from '@nestjs/common';
import { IsCashPaymentService } from './is-cash-payment.service';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Module({
  imports: [GSSharedFactorDetailAndRemainingAmountModule],
  providers: [
    {
      provide: 'IsCashPaymentService',
      useClass: IsCashPaymentService,
    },
  ],
})
export class IsCashPaymentModule {}
