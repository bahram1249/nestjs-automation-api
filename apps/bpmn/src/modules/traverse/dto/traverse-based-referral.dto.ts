import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { UserTraverseDto } from './user-traverse.dto';
import { Transaction } from 'sequelize';

export class TraverseBasedReferralDto {
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  requestState: BPMNRequestState;
  request: BPMNRequest;
  transaction: Transaction;
  userExecuterId?: bigint;
  executeBundle: string;
  description?: string;
  users?: UserTraverseDto[];
}
