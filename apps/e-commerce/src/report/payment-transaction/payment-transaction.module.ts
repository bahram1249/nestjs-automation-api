import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { PaymentTransactionController } from './payment-transaction.controller';
import { OrderQueryBuilderModule } from '../order-query-builder/order-query-builder.module';
import { PaymentTransactionService } from './payment-transaction.service';
import { PersianDate } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, PersianDate]),
    OrderQueryBuilderModule,
  ],
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService],
})
export class PaymentTransactionReportModule {}
