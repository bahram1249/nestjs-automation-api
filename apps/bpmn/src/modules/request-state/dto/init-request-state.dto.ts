import { BPMNRequest } from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class InitRequestDto {
  request: BPMNRequest;
  processId: number;
  userId?: bigint;
  returnRequestStateId?: bigint;
  transaction?: Transaction;
}
