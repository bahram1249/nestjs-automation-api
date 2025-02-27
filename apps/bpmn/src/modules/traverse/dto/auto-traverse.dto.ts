import { BPMNRequest, BPMNRequestState } from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class AutoTraverseDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  transaction: Transaction;
  description?: string;
  userExecuterId?: bigint;
  executeBundle: string;
}
