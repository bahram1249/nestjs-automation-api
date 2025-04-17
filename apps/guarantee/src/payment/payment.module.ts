import { Module } from '@nestjs/common';
import { GSPaymentService } from './payment.service';
import { GSSadadPaymentModule } from '../shared/payment/sadad';
import { FactorFinalizedModule } from '../shared/factor-finalized';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSTransaction } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([GSTransaction]),
    GSSadadPaymentModule,
    FactorFinalizedModule,
  ],
  providers: [GSPaymentService],
  exports: [GSPaymentService],
})
export class GSPaymentModule {}
