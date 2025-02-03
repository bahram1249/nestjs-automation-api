import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/database';
import { Transaction } from 'sequelize';
import { UserTraverseDto } from '@rahino/bpmn/traverse/dto/user-traverse.dto';

export class TraverseDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
  users?: UserTraverseDto[];
  transaction: Transaction;
}
