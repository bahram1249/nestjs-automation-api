import { Module } from '@nestjs/common';
import { SnapPayService, WalletService, ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { RevertInventoryModule } from '@rahino/ecommerce/inventory/revert-inventory.module';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { ECWallet } from '@rahino/database/models/ecommerce-eav/ec-wallet.entity';
import { PaymentWalletServiceProviderModule } from './payment-wallet-provider.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPaymentGateway,
      ECPayment,
      ECOrder,
      ECWallet,
    ]),
    RevertInventoryModule,
    FinalizedPaymentModule,
    PaymentWalletServiceProviderModule,
  ],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
