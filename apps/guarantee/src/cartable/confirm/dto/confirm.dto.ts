import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { ConfirmDto } from './reject-request.dto';

export class ConfirmRequestDto extends IntersectionType(
  GuaranteeTraverseDto,
  ConfirmDto,
) {}
