import {
  BPMNNode,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class RunActionDto {
  actionId: number;
  request: BPMNRequest;
  requestState: BPMNRequestState;
  node: BPMNNode;
  transaction: Transaction;
  userExecuterId?: bigint;
}
