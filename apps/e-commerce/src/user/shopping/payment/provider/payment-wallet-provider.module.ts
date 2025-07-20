import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ECommerceSmsModule } from '@rahino/ecommerce/shared/sms/ecommerce-sms.module';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { ZarinPalModule } from './zarinpal.module';
import { PaymentServiceManualWalletPurposeProviderFactory } from './factory/payment-service-manual-wallet-purpose-provider.factory';
import { RevertPaymentQtyModule } from '@rahino/ecommerce/shared/inventory/revert-payment-qty.module';

@Module({
  imports: [
    RevertPaymentQtyModule,
    SequelizeModule.forFeature([ECPaymentGateway]),
    ECommerceSmsModule,
    FinalizedPaymentModule,
    ZarinPalModule,
  ],
  providers: [PaymentServiceManualWalletPurposeProviderFactory],
  exports: [PaymentServiceManualWalletPurposeProviderFactory],
})
export class PaymentWalletServiceProviderModule {}
