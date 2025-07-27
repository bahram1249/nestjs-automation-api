import { Transaction } from 'sequelize';

export class ExistsInAnotherLogisticDto {
  userId: bigint;
  logisticId: bigint;
  transaction?: Transaction;
}
