import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { SubmitSurveyDetailDto } from './submit-suvery-detail.dto';

export class SubmitSurveyDto extends IntersectionType(
  GuaranteeTraverseDto,
  SubmitSurveyDetailDto,
) {}
