import { Module } from '@nestjs/common';
import { RemoveCashTransationActionService } from './remove-cash-transaction-action.service';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPaymentGateway, GSTransaction } from '@rahino/localdatabase/models';

@Module({
  imports: [
    GSSharedFactorDetailAndRemainingAmountModule,
    SequelizeModule.forFeature([GSTransaction, GSPaymentGateway]),
  ],
  providers: [
    {
      provide: 'RemoveCashTransationActionService',
      useClass: RemoveCashTransationActionService,
    },
  ],
})
export class RemoveCashTransactionActionModule {}
