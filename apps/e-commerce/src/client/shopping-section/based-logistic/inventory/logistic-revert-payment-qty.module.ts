import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment, ECWallet } from '@rahino/localdatabase/models';
import { LogisticRevertPaymentQtyService } from './services/logistic-revert-payment-qty.service';
import { LogisticRevertInventoryModule } from './logistic-revert-inventory.module';

@Module({
  imports: [
    LogisticRevertInventoryModule,
    SequelizeModule.forFeature([ECPayment, ECWallet]),
  ],
  providers: [LogisticRevertPaymentQtyService],
  exports: [LogisticRevertPaymentQtyService],
})
export class LogisticRevertPaymentQtyModule {}
