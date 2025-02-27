import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class AddHistoryDto {
  request: BPMNRequest;
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  oldRequestStaet: BPMNRequestState;
  requestState: BPMNRequestState;
  transaction: Transaction;
  description?: string;
  userExecuterId?: bigint;
  executeBundle: string;
}
