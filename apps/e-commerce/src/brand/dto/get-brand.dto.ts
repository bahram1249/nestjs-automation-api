import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { EntityTypeFilter } from './entity-type-filter.dto';

export class GetBrandDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  EntityTypeFilter,
) {}
