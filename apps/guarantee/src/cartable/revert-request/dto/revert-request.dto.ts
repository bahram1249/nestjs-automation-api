import { IntersectionType } from '@nestjs/swagger';
import { RevertRequestDetailDto } from './reject-request.dto';

export class RevertRequestDto extends IntersectionType(
  RevertRequestDetailDto,
) {}
