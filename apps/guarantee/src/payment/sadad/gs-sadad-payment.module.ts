import { Module } from '@nestjs/common';
import { GSSadadPaymentService } from './gs-sadad-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSFactor,
  GSPaymentGateway,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSFactor, GSTransaction, GSPaymentGateway]),
    LocalizationModule,
  ],
  providers: [GSSadadPaymentService],
  exports: [GSSadadPaymentService],
})
export class GSSadadPaymentModule {}
