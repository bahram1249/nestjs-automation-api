import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { AttributeEntityFilter, AttributeTypeFilter } from '../filter';

export class GetAttributeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  AttributeEntityFilter,
  AttributeTypeFilter,
) {}
