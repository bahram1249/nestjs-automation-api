import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway, ECPayment } from '@rahino/localdatabase/models';
import { LogisticRevertPaymentQtyModule } from '../../inventory/logistic-revert-payment-qty.module';
import { LogisticFinalizedPaymentModule } from '../util/finalized-payment/logistic-finalized-payment.module';
import { LogisticZarinPalService } from './services/logistic-zarin-pal.service';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment]),
    LogisticRevertPaymentQtyModule,
    LogisticFinalizedPaymentModule,
    LocalizationModule,
  ],
  providers: [LogisticZarinPalService],
  exports: [LogisticZarinPalService],
})
export class LogisticZarinPalModule {}
