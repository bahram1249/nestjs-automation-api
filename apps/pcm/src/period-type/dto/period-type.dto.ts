import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter/types';

export class PeriodTypeGetDto extends IntersectionType(
  IgnorePagingFilter,
  ListFilter,
) {}
