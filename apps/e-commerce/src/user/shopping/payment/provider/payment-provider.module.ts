import { Module, Scope } from '@nestjs/common';
import { ECOMMERCE_PAYMENT_PROVIDER_TOKEN } from './constants';
import { PaymentServiceProviderFactory } from './factory';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ZarinPalModule } from './zarinpal.module';
import { SnappayModule } from './snappay.module';
import { WalletModule } from './wallet.module';
import { PaymentServiceManualProviderFactory } from './factory/payment-service-manual-provider.factory';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway]),
    ZarinPalModule,
    SnappayModule,
    WalletModule,
  ],
  providers: [
    {
      provide: ECOMMERCE_PAYMENT_PROVIDER_TOKEN,
      scope: Scope.REQUEST,
      useFactory(providerFactory: PaymentServiceProviderFactory) {
        return providerFactory.create();
      },
      inject: [PaymentServiceProviderFactory],
    },
    PaymentServiceManualProviderFactory,
    PaymentServiceProviderFactory,
  ],
  exports: [
    ECOMMERCE_PAYMENT_PROVIDER_TOKEN,
    PaymentServiceManualProviderFactory,
  ],
})
export class PaymentServiceProviderModule {}
