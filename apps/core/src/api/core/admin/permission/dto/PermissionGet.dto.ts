import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from 'apps/core/src/util/core/query';
import { PermissionFilter } from '../filter';

export class PermissionGetDto extends IntersectionType(
  ListFilter,
  PermissionFilter,
) {}
