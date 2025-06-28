import { Module, Scope } from '@nestjs/common';
import { ECOMMERCE_SINGLE_VENDOR_PAYMENT_PROVIDER_TOKEN } from './constants';
import { SingleVendorPaymentServiceProviderFactory } from './factory';
import { SingleVendorPaymentServiceManualProviderFactory } from './factory/single-vendor-payment-service-manual-provider.factory';
import { SingleVendorZarinPalModule } from './zarinpal';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SingleVendorZarinPalModule,
    SequelizeModule.forFeature([ECPaymentGateway]),
  ],
  providers: [
    {
      provide: ECOMMERCE_SINGLE_VENDOR_PAYMENT_PROVIDER_TOKEN,
      scope: Scope.REQUEST,
      useFactory(providerFactory: SingleVendorPaymentServiceProviderFactory) {
        return providerFactory.create();
      },
      inject: [SingleVendorPaymentServiceProviderFactory],
    },
    SingleVendorPaymentServiceManualProviderFactory,
    SingleVendorPaymentServiceProviderFactory,
  ],
  exports: [
    ECOMMERCE_SINGLE_VENDOR_PAYMENT_PROVIDER_TOKEN,
    SingleVendorPaymentServiceManualProviderFactory,
  ],
})
export class SingleVendorPaymentProdviderModule {}
