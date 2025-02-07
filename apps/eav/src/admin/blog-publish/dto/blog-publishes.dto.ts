import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetBlogPublishDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
