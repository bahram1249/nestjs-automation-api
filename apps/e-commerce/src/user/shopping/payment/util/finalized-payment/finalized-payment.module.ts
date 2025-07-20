import { Module } from '@nestjs/common';
import { FinalizedPaymentService } from './finalized-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECommerceSmsModule } from '@rahino/ecommerce/shared/sms/ecommerce-sms.module';
import { User } from '@rahino/database';
import { ECPaymentGatewayCommission } from '@rahino/localdatabase/models';
import { ECWallet } from '@rahino/localdatabase/models';

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
