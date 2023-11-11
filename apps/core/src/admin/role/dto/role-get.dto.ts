import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter/types';
import { RoleFilter } from '../filter';

export class RoleGetDto extends IntersectionType(ListFilter, RoleFilter) {}
