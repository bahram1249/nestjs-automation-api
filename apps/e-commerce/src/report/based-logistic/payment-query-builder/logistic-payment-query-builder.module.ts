import { Module } from '@nestjs/common';
import { LogisticPaymentQueryBuilderService } from './logistic-payment-query-builder.service';

@Module({
  providers: [LogisticPaymentQueryBuilderService],
  exports: [LogisticPaymentQueryBuilderService],
})
export class LogisticPaymentQueryBuilderModule {}
