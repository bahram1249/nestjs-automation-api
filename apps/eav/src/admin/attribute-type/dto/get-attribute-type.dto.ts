import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetAttributeTypeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
