import { Module } from '@nestjs/common';
import { SnapPayService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECommerceSmsModule } from '@rahino/ecommerce/shared/sms/ecommerce-sms.module';
import { User } from '@rahino/database';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { RevertPaymentQtyModule } from '@rahino/ecommerce/shared/inventory/revert-payment-qty.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder, User]),
    RevertPaymentQtyModule,
    ECommerceSmsModule,
    FinalizedPaymentModule,
  ],
  providers: [SnapPayService],
  exports: [SnapPayService],
})
export class SnappayModule {}
