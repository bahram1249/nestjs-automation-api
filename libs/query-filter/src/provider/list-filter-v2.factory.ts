import { Injectable } from '@nestjs/common';
import { ListFilter, SortOrder } from '../types';

@Injectable()
export class ListFilterV2Factory {
  constructor() {}
  async create() {
    const listFilter = new ListFilter();
    listFilter.search = '%%';
    listFilter.offset = null;
    listFilter.limit = null;
    listFilter.sortOrder = SortOrder.DESC;
    listFilter.orderBy = 'id';
    return listFilter;
  }
}
