import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from 'apps/core/src/util/core/query';
import { PermissionGroupFilter } from '../filter';

export class PermissionGroupGetDto extends IntersectionType(
  ListFilter,
  PermissionGroupFilter,
) {}
