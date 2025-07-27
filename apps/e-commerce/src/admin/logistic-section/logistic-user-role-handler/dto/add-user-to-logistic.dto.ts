import { Transaction } from 'sequelize';
import { LogisticUserDto } from './logistic-user.dto';

export class AddUserToLogisticDto {
  logisticId: bigint;
  user: LogisticUserDto;
  isDefault?: boolean;
  isUpdateLogistic?: boolean;
  transaction?: Transaction;
}
