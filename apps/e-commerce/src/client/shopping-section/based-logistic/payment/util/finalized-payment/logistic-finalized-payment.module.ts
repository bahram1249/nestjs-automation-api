import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECLogisticOrderGrouped,
  ECPayment,
  ECPaymentGatewayCommission,
  ECWallet,
} from '@rahino/localdatabase/models';
import { ECLogisticOrder } from '@rahino/localdatabase/models';
import { LogisticEcommerceSmsModule } from '../../../sms/logistic-ecommerce-sms.module';
import { User } from '@rahino/database';
import { LogisticFinalizedPaymentService } from './logistic-finalized-payment.service';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPayment,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      User,
      ECPaymentGatewayCommission,
      ECWallet,
    ]),
    LogisticEcommerceSmsModule,
    LocalizationModule,
  ],
  providers: [LogisticFinalizedPaymentService],
  exports: [LogisticFinalizedPaymentService],
})
export class LogisticFinalizedPaymentModule {}
