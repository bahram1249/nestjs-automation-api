import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';

export class PickOrganizationDto extends IntersectionType(
  GuaranteeTraverseDto,
) {}
