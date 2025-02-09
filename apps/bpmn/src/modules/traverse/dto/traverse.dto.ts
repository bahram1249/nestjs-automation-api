import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/database';
import { Transaction } from 'sequelize';
import { UserTraverseDto } from './user-traverse.dto';

export class TraverseDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  users?: UserTraverseDto[];
  transaction: Transaction;
}
