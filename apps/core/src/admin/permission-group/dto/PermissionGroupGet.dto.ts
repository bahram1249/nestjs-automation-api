import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter/types';
import { PermissionGroupFilter } from '../filter';

export class PermissionGroupGetDto extends IntersectionType(
  ListFilter,
  PermissionGroupFilter,
) {}
