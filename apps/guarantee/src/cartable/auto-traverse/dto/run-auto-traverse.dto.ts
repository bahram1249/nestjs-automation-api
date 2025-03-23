import { BPMNRequest, BPMNRequestState } from '@rahino/localdatabase/models';

export class RunAutoTraverseDto {
  requestState: BPMNRequestState;
  request: BPMNRequest;
  description?: string;
}
