import { Module } from '@nestjs/common';
import { IsOnlineWithNoPaymentService } from './is-online-with-no-payment.service';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Module({
  imports: [GSSharedFactorDetailAndRemainingAmountModule],
  providers: [
    {
      provide: 'IsOnlineWithNoPaymentService',
      useClass: IsOnlineWithNoPaymentService,
    },
  ],
})
export class IsOnlineWithNoPaymentModule {}
