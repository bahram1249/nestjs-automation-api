import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetAdditionalPackageDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
