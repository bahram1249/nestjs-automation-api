import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrder } from '@rahino/localdatabase/models';
import { BasedPaymentTransactionController } from './payment-transaction.controller';
import { BasedPaymentTransactionService } from './payment-transaction.service';
import { LogisticPaymentQueryBuilderModule } from '../payment-query-builder/logistic-payment-query-builder.module';

@Module({
  imports: [
    LogisticPaymentQueryBuilderModule,
    SequelizeModule.forFeature([
      PersianDate,
      ECLogisticOrder,
      User,
      Permission,
    ]),
  ],
  controllers: [BasedPaymentTransactionController],
  providers: [BasedPaymentTransactionService],
})
export class BasedPaymentTransactionModule {}
