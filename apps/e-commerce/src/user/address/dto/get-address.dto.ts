import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetAddressDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
