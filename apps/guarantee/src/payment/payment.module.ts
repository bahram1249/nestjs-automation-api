import { Module } from '@nestjs/common';
import { GSPaymentService } from './payment.service';
import { GSSadadPaymentModule } from '../shared/payment/sadad';
import { FactorFinalizedModule } from '../shared/factor-finalized';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSTransaction } from '@rahino/localdatabase/models';
import { GSPaymentController } from './payment.controller';
import { User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([GSTransaction, User]),
    GSSadadPaymentModule,
    FactorFinalizedModule,
  ],
  providers: [GSPaymentService],
  exports: [GSPaymentService],
  controllers: [GSPaymentController],
})
export class GSPaymentModule {}
