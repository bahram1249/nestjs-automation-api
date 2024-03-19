import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { ConditionTypeDto } from './condition-type.dto';

export class GetConditionValueDto extends IntersectionType(
  ListFilter,
  ConditionTypeDto,
) {}
