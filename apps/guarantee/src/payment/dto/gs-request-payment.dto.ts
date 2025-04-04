import { Transaction } from 'sequelize';

export class GSRequestPaymentDto {
  factorId: bigint;
  userId: bigint;
  transaction: Transaction;
}
