import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ECPayment } from '@rahino/database';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPayment])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
