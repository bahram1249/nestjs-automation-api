import { User } from '@rahino/database';
import { Transaction } from 'sequelize';

export class AccessToLogisticDto {
  user: User;
  logisticId: bigint;
  transaction?: Transaction;
}
