import { Module, Scope } from '@nestjs/common';
import { ECOMMERCE_PAYMENT_PROVIDER_TOKEN } from './constants';
import { PaymentServiceProviderFactory } from './factory';
import { SnapPayService, WalletService, ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';

@Module({
  imports: [
    InventoryModule,
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder]),
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
    PaymentServiceProviderFactory,
    SnapPayService,
    ZarinPalService,
    WalletService,
  ],
  exports: [ECOMMERCE_PAYMENT_PROVIDER_TOKEN],
})
export class PaymentServiceProviderModule {}
