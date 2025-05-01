import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GSRequestAttachmentDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
