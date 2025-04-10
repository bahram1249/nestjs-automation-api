import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { PickTechnicalUserDetailDto } from './pick-technical-user-detail.dto';

export class PickTechnicalUserDto extends IntersectionType(
  GuaranteeTraverseDto,
  PickTechnicalUserDetailDto,
) {}
