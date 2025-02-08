import { BPMNNode, BPMNRequest, BPMNRequestState } from '@rahino/database';
import { UserTraverseDto } from './user-traverse.dto';
import { Transaction } from 'sequelize';

export class TraverseBasedReferralDto {
  node: BPMNNode;
  requestState: BPMNRequestState;
  request: BPMNRequest;
  transaction: Transaction;
  users?: UserTraverseDto[];
}
