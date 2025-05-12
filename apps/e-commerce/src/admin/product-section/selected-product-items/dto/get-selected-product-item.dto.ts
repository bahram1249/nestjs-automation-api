import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { SelectedProductIdFilter } from './selected-product-id.dto';

export class GetSelectedProductItemDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  SelectedProductIdFilter,
) {}
