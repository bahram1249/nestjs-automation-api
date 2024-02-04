import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { EntityModelFilter, ParentEntityTypeFilter } from '../filter';
import { IgnoreChildFilter } from '../filter/ignore-child.filter';

export class GetEntityTypeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  EntityModelFilter,
  ParentEntityTypeFilter,
  IgnoreChildFilter,
) {}
