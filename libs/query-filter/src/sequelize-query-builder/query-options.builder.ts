import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

export class QueryOptionsBulder {
  options: Omit<FindAndCountOptions<any>, 'group'>;
  constructor() {
    this.options = {
      where: {
        [Op.and]: [],
      },
    };
    return this;
  }
  limit(count?: number) {
    if (count) this.options.limit = count;
    return this;
  }
  offset(count?: number) {
    if (count) this.options.offset = count;
    return this;
  }
  order(orderBy: string, sortOrder: string) {
    this.options.order = [[orderBy, sortOrder]];
    return this;
  }
  filter(condition: WhereOptions<any>) {
    this.options.where[Op.and].push(condition);
    return this;
  }
  build() {
    return this.options;
  }
}
