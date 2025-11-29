import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECWallet,
  ECPaymentGateway,
  ECPayment,
} from '@rahino/localdatabase/models';
import { LogisticFinalizedPaymentModule } from '../util/finalized-payment/logistic-finalized-payment.module';
import { LogisticWalletService } from './services/logistic-wallet.service';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { LogisticZarinPalModule } from './zarinpal.module';
import { LogisticSnappayModule } from './snappay.module';
import { LogisticPaymentServiceManualWalletPurposeProviderFactory } from './factory/logistic-payment-service-manual-wallet-purpose-provider.factory';

@Module({
  imports: [
    SequelizeModule.forFeature([ECWallet, ECPaymentGateway, ECPayment]),
    LogisticFinalizedPaymentModule,
    // Import specific gateways used by wallet-purpose provider to avoid cycles
    LogisticZarinPalModule,
    LogisticSnappayModule,
    LocalizationModule,
  ],
  providers: [
    LogisticWalletService,
    LogisticPaymentServiceManualWalletPurposeProviderFactory,
  ],
  exports: [LogisticWalletService],
})
export class LogisticWalletModule {}
