import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { SelectedProductTypeFilter } from './selected-type-filter.dto';

export class GetSelectedProductDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  SelectedProductTypeFilter,
) {}
