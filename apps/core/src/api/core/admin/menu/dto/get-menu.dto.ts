import { IntersectionType } from '@nestjs/swagger';
import { MenuFilter } from '../filter/menu.filter';
import { ListFilter } from 'apps/core/src/util/core/query';

export class GetMenuDto extends IntersectionType(MenuFilter, ListFilter) {}
