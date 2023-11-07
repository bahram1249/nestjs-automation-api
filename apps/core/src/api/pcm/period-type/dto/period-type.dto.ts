import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from 'apps/core/src/util/core/query';

export class PeriodTypeGetDto extends IntersectionType(
  IgnorePagingFilter,
  ListFilter,
) {}
