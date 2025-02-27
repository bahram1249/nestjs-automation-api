import { BPMNPROCESS } from '@rahino/localdatabase/models';

export class InitRequestDto {
  userId: bigint;
  organizationId?: number;
  processId?: number;
  description?: string;
}
