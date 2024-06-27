import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { UserDetailDto } from './user-detail.dto';

export class GetAddressDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
