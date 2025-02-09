import { BPMNRequest, BPMNRequestState } from '@rahino/database';
import { Transaction } from 'sequelize';

export class RunActionDto {
  actionId: number;
  request: BPMNRequest;
  requestState: BPMNRequestState;
  transaction: Transaction;
}
