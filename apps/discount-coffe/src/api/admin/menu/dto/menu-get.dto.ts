import { IntersectionType } from '@nestjs/swagger';
import { MenuQuery } from './menu.query';
import { ListFilter } from '@rahino/query-filter';

export class MenuGetDto extends IntersectionType(MenuQuery, ListFilter) {}
