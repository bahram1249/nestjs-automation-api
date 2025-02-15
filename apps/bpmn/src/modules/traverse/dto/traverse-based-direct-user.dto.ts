import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/database';
import { Transaction } from 'sequelize';
import { UserTraverseDto } from './user-traverse.dto';

export class TraverseBasedDirectUserDto {
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  requestState: BPMNRequestState;
  request: BPMNRequest;
  transaction: Transaction;
  users?: UserTraverseDto[];
  description?: string;
  userExecuterId?: bigint;
  executeBundle: string;
}
