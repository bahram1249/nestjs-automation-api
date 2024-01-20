import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetColorDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
