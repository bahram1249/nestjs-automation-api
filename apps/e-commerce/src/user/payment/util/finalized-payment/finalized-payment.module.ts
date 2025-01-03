import { Module } from '@nestjs/common';
import { FinalizedPaymentService } from './finalized-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { User } from '@rahino/database';
import { ECPaymentGatewayCommission } from '@rahino/database';
import { ECWallet } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPayment,
      ECOrder,
      User,
      ECPaymentGatewayCommission,
      ECWallet,
    ]),
    ECommerceSmsModule,
  ],
  providers: [FinalizedPaymentService],
  exports: [FinalizedPaymentService],
})
export class FinalizedPaymentModule {}
