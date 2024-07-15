import { Module } from '@nestjs/common';
import { SnapPayService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { User } from '@rahino/database/models/core/user.entity';
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
