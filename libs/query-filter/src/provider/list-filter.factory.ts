import { emptyListFilter } from './constants';
import { ListFilter, SortOrder } from '@rahino/query-filter';

export const listFilterFactory = {
  provide: emptyListFilter,
  useFactory: () => {
    const listFilter = new ListFilter();
    listFilter.search = '%%';
    listFilter.offset = null;
    listFilter.limit = null;
    listFilter.sortOrder = SortOrder.DESC;
    listFilter.orderBy = 'id';
    return listFilter;
  },
};
