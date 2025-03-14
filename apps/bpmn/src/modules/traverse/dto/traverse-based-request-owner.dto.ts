import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class TraverseBaseRequestOwnerDto {
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  requestState: BPMNRequestState;
  request: BPMNRequest;
  transaction: Transaction;
  description?: string;
  userExecuterId?: bigint;
  executeBundle: string;
}
