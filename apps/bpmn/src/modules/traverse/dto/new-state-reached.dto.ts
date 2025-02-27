import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class NewStateReachedDto {
  request: BPMNRequest;
  oldRequestState: BPMNRequestState;
  newRequestState: BPMNRequestState;
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  transaction: Transaction;
  description?: string;
  userExecuterId?: bigint;
  executeBundle: string;
}
