import { Module } from '@nestjs/common';
import { SnapPayService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database';
import { ECPayment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { User } from '@rahino/database';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';
import { RevertPaymentQtyModule } from '@rahino/ecommerce/inventory/revert-payment-qty.module';

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
