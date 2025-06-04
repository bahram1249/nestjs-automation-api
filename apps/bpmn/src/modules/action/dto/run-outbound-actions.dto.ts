import {
  BPMNNode,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class RunOutboundActionsDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  node: BPMNNode;
  transaction: Transaction;
  userExecuterId?: bigint;
}
