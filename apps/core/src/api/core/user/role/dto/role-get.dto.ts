import { IntersectionType } from '@nestjs/swagger';
import { RoleFilter } from '../filter';
import { ListFilter } from 'apps/core/src/util/core/query';

export class RoleGetDto extends IntersectionType(RoleFilter, ListFilter) {}
