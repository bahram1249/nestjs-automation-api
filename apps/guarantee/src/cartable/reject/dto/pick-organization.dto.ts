import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { RejectRequestDto } from './reject-request.dto';

export class RejectDto extends IntersectionType(
  GuaranteeTraverseDto,
  RejectRequestDto,
) {}
