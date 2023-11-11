import { IntersectionType } from '@nestjs/swagger';
import { MenuFilter } from '../filter/menu.filter';
import { ListFilter } from '@rahino/query-filter/types';

export class GetMenuDto extends IntersectionType(MenuFilter, ListFilter) {}
