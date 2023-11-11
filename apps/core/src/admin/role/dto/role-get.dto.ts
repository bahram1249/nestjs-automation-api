import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from 'apps/core/src/util/core/query';
import { RoleFilter } from '../filter';

export class RoleGetDto extends IntersectionType(ListFilter, RoleFilter) {}
