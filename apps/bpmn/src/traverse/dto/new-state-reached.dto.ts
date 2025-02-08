import { BPMNNode, BPMNRequest, BPMNRequestState } from '@rahino/database';
import { Transaction } from 'sequelize';

export class NewStateReachedDto {
  request: BPMNRequest;
  newRequestState: BPMNRequestState;
  node: BPMNNode;
  transaction: Transaction;
}
