import { User } from '@rahino/database';
import { Transaction } from 'sequelize';

export class RemoveUserFromLogisticDto {
  user: User;
  logisticId: bigint;
  transaction?: Transaction;
}
