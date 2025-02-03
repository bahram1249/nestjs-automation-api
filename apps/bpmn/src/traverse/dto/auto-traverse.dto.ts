import { BPMNRequest, BPMNRequestState } from '@rahino/database';
import { Transaction } from 'sequelize';

export class AutoTraverseDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  transaction: Transaction;
}
