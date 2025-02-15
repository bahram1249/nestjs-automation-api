import { BPMNPROCESS } from '@rahino/database';

export class InitRequestDto {
  userId: bigint;
  organizationId?: number;
  processId?: number;
  description?: string;
}
