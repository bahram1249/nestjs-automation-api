import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { SetOrganizationDto } from './set-orgnization.dto';

export class PickOrganizationDto extends IntersectionType(
  GuaranteeTraverseDto,
  SetOrganizationDto,
) {}
