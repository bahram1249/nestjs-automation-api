import { IntersectionType } from '@nestjs/swagger';
import { SubmitFactorInRequestLocationDetailDto } from './submit-factor-in-request-location-detail.dto';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';

export class SubmitFactorInRequestLocationDto extends IntersectionType(
  GuaranteeTraverseDto,
  SubmitFactorInRequestLocationDetailDto,
) {}
