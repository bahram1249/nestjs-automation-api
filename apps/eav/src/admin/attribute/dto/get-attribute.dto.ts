import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { AttributeEntityFilter } from '../filter';

export class GetAttributeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  AttributeEntityFilter,
) {}
