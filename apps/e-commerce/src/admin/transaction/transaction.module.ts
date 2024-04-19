import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPayment])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
