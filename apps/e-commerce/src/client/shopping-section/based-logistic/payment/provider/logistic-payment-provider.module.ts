import { Module, Scope } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { LOGISTIC_PAYMENT_PROVIDER_TOKEN } from './constants';
import { LogisticPaymentServiceProviderFactory } from './factory/logistic-payment-service-provider.factory';
import { LogisticPaymentServiceManualProviderFactory } from './factory/logistic-payment-service-manual-provider.factory';
import { LogisticZarinPalModule } from './zarinpal.module';
import { LogisticSnappayModule } from './snappay.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway]),
    LogisticZarinPalModule,
    LogisticSnappayModule,
    LocalizationModule,
  ],
  providers: [
    {
      provide: LOGISTIC_PAYMENT_PROVIDER_TOKEN,
      scope: Scope.REQUEST,
      useFactory(providerFactory: LogisticPaymentServiceProviderFactory) {
        return providerFactory.create();
      },
      inject: [LogisticPaymentServiceProviderFactory],
    },
    LogisticPaymentServiceManualProviderFactory,
    LogisticPaymentServiceProviderFactory,
  ],
  exports: [
    LOGISTIC_PAYMENT_PROVIDER_TOKEN,
    LogisticPaymentServiceManualProviderFactory,
  ],
})
export class LogisticPaymentProviderModule {}
