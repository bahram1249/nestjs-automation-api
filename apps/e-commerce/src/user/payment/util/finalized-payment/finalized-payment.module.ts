import { Module } from '@nestjs/common';
import { FinalizedPaymentService } from './finalized-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { User } from '@rahino/database/models/core/user.entity';
import { ECPaymentGatewayCommission } from '@rahino/database/models/ecommerce-eav/ec-paymentgateway-commission.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPayment,
      ECOrder,
      User,
      ECPaymentGatewayCommission,
    ]),
    ECommerceSmsModule,
  ],
  providers: [FinalizedPaymentService],
  exports: [FinalizedPaymentService],
})
export class FinalizedPaymentModule {}
