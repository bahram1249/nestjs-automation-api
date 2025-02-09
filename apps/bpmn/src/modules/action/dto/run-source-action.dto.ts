import { BPMNAction, BPMNRequest, BPMNRequestState } from '@rahino/database';
import { Transaction } from 'sequelize';

export class RunSourceActionDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  action: BPMNAction;
  transaction: Transaction;
}
