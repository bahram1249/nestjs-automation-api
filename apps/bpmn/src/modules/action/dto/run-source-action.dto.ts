import {
  BPMNAction,
  BPMNNode,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class RunSourceActionDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  action: BPMNAction;
  node: BPMNNode;
  transaction: Transaction;
  userExecuterId?: bigint;
}
