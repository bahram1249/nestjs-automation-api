import { BPMNNode } from '@rahino/database';
import { UserTraverseDto } from '@rahino/bpmn/traverse/dto/user-traverse.dto';

export class FindReferralTypeDto {
  node: BPMNNode;
  users?: UserTraverseDto[];
}
