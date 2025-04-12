import { Module } from '@nestjs/common';
import { IsOnlinePaymentService } from './is-online-payment.service';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Module({
  imports: [GSSharedFactorDetailAndRemainingAmountModule],
  providers: [
    {
      provide: 'IsOnlinePaymentService',
      useClass: IsOnlinePaymentService,
    },
  ],
})
export class IsOnlinePaymentModule {}
