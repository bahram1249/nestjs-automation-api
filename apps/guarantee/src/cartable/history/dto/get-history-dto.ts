import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetHistoryDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
