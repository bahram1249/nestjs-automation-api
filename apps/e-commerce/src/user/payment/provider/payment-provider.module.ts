import { Module, Scope } from '@nestjs/common';
import { ECOMMERCE_PAYMENT_PROVIDER_TOKEN } from './constants';
import { PaymentServiceProviderFactory } from './factory';
import { SnapPayService, WalletService, ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { PaymentServiceManualProviderFactory } from './factory/payment-service-manual-provider.factory';
import { RevertInventoryModule } from '@rahino/ecommerce/inventory/revert-inventory.module';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { User } from '@rahino/database/models/core/user.entity';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';

@Module({
  imports: [
    RevertInventoryModule,
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder, User]),
    ECommerceSmsModule,
    FinalizedPaymentModule,
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
    SnapPayService,
    ZarinPalService,
    WalletService,
  ],
  exports: [
    ECOMMERCE_PAYMENT_PROVIDER_TOKEN,
    PaymentServiceManualProviderFactory,
  ],
})
export class PaymentServiceProviderModule {}
