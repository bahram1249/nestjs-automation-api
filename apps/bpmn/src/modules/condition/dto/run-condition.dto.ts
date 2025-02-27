import {
  BPMNRequest,
  BPMNRequestState,
  BPMNNode,
  BPMNCondition,
} from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';

export class RunConditionDto {
  request: BPMNRequest;
  requestState: BPMNRequestState;
  node: BPMNNode;
  condition: BPMNCondition;
  transaction: Transaction;
}
