import { IntersectionType } from '@nestjs/swagger';
import { RoleFilter } from '../filter';
import { ListFilter } from '@rahino/query-filter/types';

export class RoleGetDto extends IntersectionType(RoleFilter, ListFilter) {}
