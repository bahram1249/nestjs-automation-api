import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { PickSupervisorDto } from './pick-supervisor.dto';

export class RejectDto extends IntersectionType(
  GuaranteeTraverseDto,
  PickSupervisorDto,
) {}
