import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { PaymentTransactionController } from './payment-transaction.controller';
import { OrderQueryBuilderModule } from '../order-query-builder/order-query-builder.module';
import { PaymentTransactionService } from './payment-transaction.service';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, PersianDate]),
    OrderQueryBuilderModule,
  ],
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService],
})
export class PaymentTransactionReportModule {}
