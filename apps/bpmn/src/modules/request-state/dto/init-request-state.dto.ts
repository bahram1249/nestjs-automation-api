import { BPMNRequest } from '@rahino/database';
import { Transaction } from 'sequelize';

export class InitRequestDto {
  request: BPMNRequest;
  processId: number;
  userId?: number;
  returnRequestStateId?: bigint;
  transaction?: Transaction;
}
