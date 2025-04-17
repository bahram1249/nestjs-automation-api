import { Module } from '@nestjs/common';
import { GSSadadPaymentService } from './gs-sadad-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSFactor,
  GSPaymentGateway,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';

@Module({
  imports: [
    SequelizeModule.forFeature([GSFactor, GSTransaction, GSPaymentGateway]),
    LocalizationModule,
    RialPriceModule,
  ],
  providers: [GSSadadPaymentService],
  exports: [GSSadadPaymentService],
})
export class GSSadadPaymentModule {}
