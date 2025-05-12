import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetCourierDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
