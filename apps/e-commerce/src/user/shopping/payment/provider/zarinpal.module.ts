import { Module } from '@nestjs/common';
import { ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { RevertPaymentQtyModule } from '@rahino/ecommerce/shared/inventory/revert-payment-qty.module';

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
