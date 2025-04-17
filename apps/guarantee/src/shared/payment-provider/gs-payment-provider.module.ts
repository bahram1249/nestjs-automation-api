import { Module, Scope } from '@nestjs/common';
import { GS_PAYMENT_PROVIDER_TOKEN } from './constants';
import { GSPaymentServiceProviderFactory } from './factory';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPaymentGateway } from '@rahino/localdatabase/models';
import { GSPaymentServiceManualProviderFactory } from './factory/gs-payment-service-manual-provider.factory';
import { GSSadadPaymentModule } from '../payment/sadad';

@Module({
  imports: [
    SequelizeModule.forFeature([GSPaymentGateway]),
    GSSadadPaymentModule,
  ],
  providers: [
    {
      provide: GS_PAYMENT_PROVIDER_TOKEN,
      scope: Scope.REQUEST,
      useFactory(providerFactory: GSPaymentServiceProviderFactory) {
        return providerFactory.create();
      },
      inject: [GSPaymentServiceProviderFactory],
    },
    GSPaymentServiceManualProviderFactory,
    GSPaymentServiceProviderFactory,
  ],
  exports: [GS_PAYMENT_PROVIDER_TOKEN, GSPaymentServiceManualProviderFactory],
})
export class GSPaymentServiceProviderModule {}
