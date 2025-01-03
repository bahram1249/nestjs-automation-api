import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ECPayment } from '@rahino/database';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([ECPayment])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
