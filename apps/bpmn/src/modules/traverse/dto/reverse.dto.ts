import { BPMNRequest } from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class ReverseDto {
  request: BPMNRequest;
  historyBundle: string;
  userExecuterId?: bigint;
  executeBundle?: string;
  description?: string;
  transaction: Transaction;
}
