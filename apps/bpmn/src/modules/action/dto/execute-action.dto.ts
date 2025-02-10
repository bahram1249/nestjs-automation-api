import { BPMNNode, BPMNRequest, BPMNRequestState } from '@rahino/database';
import { Transaction } from 'sequelize';

export class ExecuteActionDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  node: BPMNNode;
  transaction: Transaction;
}
