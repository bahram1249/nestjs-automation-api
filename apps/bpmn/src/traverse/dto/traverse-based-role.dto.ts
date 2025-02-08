import { BPMNNode, BPMNRequest, BPMNRequestState } from '@rahino/database';
import { Transaction } from 'sequelize';
import { UserTraverseDto } from './user-traverse.dto';

export class TraverseBasedRoleDto {
  node: BPMNNode;
  requestState: BPMNRequestState;
  request: BPMNRequest;
  transaction: Transaction;
  users?: UserTraverseDto[];
}
