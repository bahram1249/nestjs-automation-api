import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { SetSolutionItemDto } from './set-solution-item.dto';

export class SubmitSolutionItemDto extends IntersectionType(
  GuaranteeTraverseDto,
  SetSolutionItemDto,
) {}
