import { Module } from '@nestjs/common';
import { GSTransactionService } from './transaction.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSTransaction } from '@rahino/localdatabase/models';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSTransaction])],
  controllers: [TransactionController],
  providers: [GSTransactionService],
  exports: [GSTransactionService],
})
export class GSClientTransactionModule {}
