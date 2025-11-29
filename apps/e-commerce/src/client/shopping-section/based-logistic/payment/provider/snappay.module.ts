import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECPaymentGateway,
  ECPayment,
  ECOrder,
} from '@rahino/localdatabase/models';
import { LogisticRevertPaymentQtyModule } from '../../inventory/logistic-revert-payment-qty.module';
import { User } from '@rahino/database';
import { LogisticFinalizedPaymentModule } from '../util/finalized-payment/logistic-finalized-payment.module';
import { LogisticSnapPayService } from './services/logistic-snap-pay.service';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder, User]),
    LogisticRevertPaymentQtyModule,
    LogisticFinalizedPaymentModule,
    LocalizationModule,
  ],
  providers: [LogisticSnapPayService],
  exports: [LogisticSnapPayService],
})
export class LogisticSnappayModule {}
