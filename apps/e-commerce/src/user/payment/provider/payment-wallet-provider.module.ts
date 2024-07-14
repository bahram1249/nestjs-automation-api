import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { RevertInventoryModule } from '@rahino/ecommerce/inventory/revert-inventory.module';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { ZarinPalModule } from './zarinpal.module';
import { ZarinPalService } from './services';
import { PaymentServiceManualWalletPurposeProviderFactory } from './factory/payment-service-manual-wallet-purpose-provider.factory';

@Module({
  imports: [
    RevertInventoryModule,
    SequelizeModule.forFeature([ECPaymentGateway]),
    ECommerceSmsModule,
    FinalizedPaymentModule,
    ZarinPalModule,
  ],
  providers: [PaymentServiceManualWalletPurposeProviderFactory],
  exports: [PaymentServiceManualWalletPurposeProviderFactory],
})
export class PaymentWalletServiceProviderModule {}
