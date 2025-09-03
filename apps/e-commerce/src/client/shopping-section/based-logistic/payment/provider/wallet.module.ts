import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECWallet, ECPaymentGateway, ECPayment } from '@rahino/localdatabase/models';
import { LogisticFinalizedPaymentModule } from '../util/finalized-payment/logistic-finalized-payment.module';
import { LogisticWalletService } from './services/logistic-wallet.service';
import { LogisticPaymentProviderModule } from './logistic-payment-provider.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([ECWallet, ECPaymentGateway, ECPayment]),
    LogisticFinalizedPaymentModule,
    // Use the provider module which exports the manual factory and gateways
    LogisticPaymentProviderModule,
    LocalizationModule,
  ],
  providers: [LogisticWalletService],
  exports: [LogisticWalletService],
})
export class LogisticWalletModule {}
