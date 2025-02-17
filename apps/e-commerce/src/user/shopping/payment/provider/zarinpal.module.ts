import { Module } from '@nestjs/common';
import { ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database';
import { ECPayment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { RevertPaymentQtyModule } from '@rahino/ecommerce/inventory/revert-payment-qty.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder]),
    RevertPaymentQtyModule,
    FinalizedPaymentModule,
  ],
  providers: [ZarinPalService],
  exports: [ZarinPalService],
})
export class ZarinPalModule {}
