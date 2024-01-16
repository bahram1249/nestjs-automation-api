import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { AttributeValueFilter } from '../filter';

export class GetAttributeValueDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  AttributeValueFilter,
) {}
