import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';

export class ValidateAndReturnCartableItemDto {
  requestState: BPMNRequestState;
  request: BPMNRequest;
  node: BPMNNode;
  nodeCommand: BPMNNodeCommand;
}
