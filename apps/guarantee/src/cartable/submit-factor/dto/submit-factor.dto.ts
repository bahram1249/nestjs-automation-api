import { IntersectionType } from '@nestjs/swagger';
import { SubmitFactorDetailDto } from './submit-factor-detail.dto';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';

export class SubmitFactorDto extends IntersectionType(
  GuaranteeTraverseDto,
  SubmitFactorDetailDto,
) {}
