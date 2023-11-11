import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter/types';
import { PermissionFilter } from '../filter';

export class PermissionGetDto extends IntersectionType(
  ListFilter,
  PermissionFilter,
) {}
