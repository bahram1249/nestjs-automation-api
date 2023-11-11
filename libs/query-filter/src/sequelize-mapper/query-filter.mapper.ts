import { FindAndCountOptions } from 'sequelize';
import { ListFilter } from '../types';

export class QueryFilter {
  public static toFindAndCountOptions(
    options: Omit<FindAndCountOptions<any>, 'group'>,
    query: ListFilter,
  ): Omit<FindAndCountOptions<any>, 'group'> {
    options.limit = query.limit;
    options.offset = query.offset;
    options.order = [[query.orderBy, query.sortOrder]];
    return options;
  }

  public static limitOffset(
    options: Omit<FindAndCountOptions<any>, 'group'>,
    query: ListFilter,
  ): Omit<FindAndCountOptions<any>, 'group'> {
    options.limit = query.limit;
    options.offset = query.offset;
    return options;
  }

  public static order(
    options: Omit<FindAndCountOptions<any>, 'group'>,
    query: ListFilter,
  ): Omit<FindAndCountOptions<any>, 'group'> {
    options.order = [[query.orderBy, query.sortOrder]];
    return options;
  }

  public static init(): Omit<FindAndCountOptions<any>, 'group'> {
    const options: Omit<FindAndCountOptions<any>, 'group'> = {};
    return options;
  }
}
