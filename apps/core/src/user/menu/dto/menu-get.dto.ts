import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter/types';

export class MenuGetDto extends IntersectionType(
  IgnorePagingFilter,
  ListFilter,
) {}
