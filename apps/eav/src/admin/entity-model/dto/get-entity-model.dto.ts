import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetEntityModelDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
