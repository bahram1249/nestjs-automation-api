import { IntersectionType } from '@nestjs/swagger';
import { RevertToTechnicalUserDetailDto } from './revert-to-technical-user-detail.dto';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';

export class RevertToTechncialUserDto extends IntersectionType(
  GuaranteeTraverseDto,
  RevertToTechnicalUserDetailDto,
) {}
