import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetBrandDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
