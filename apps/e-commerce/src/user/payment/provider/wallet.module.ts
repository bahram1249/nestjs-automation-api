import { Module } from '@nestjs/common';
import { SnapPayService, WalletService, ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database';
import { ECPayment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { ECWallet } from '@rahino/database';
import { PaymentWalletServiceProviderModule } from './payment-wallet-provider.module';
import { RevertPaymentQtyModule } from '@rahino/ecommerce/inventory/revert-payment-qty.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPaymentGateway,
      ECPayment,
      ECOrder,
      ECWallet,
    ]),
    RevertPaymentQtyModule,
    FinalizedPaymentModule,
    PaymentWalletServiceProviderModule,
  ],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
