import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { EntityModelFilter } from '../filter';

export class GetEntityTypeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  EntityModelFilter,
) {}
