import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetGuaranteeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
