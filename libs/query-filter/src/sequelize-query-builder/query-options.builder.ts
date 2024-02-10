import { FindAndCountOptions, Includeable, Op, WhereOptions } from 'sequelize';

export class QueryOptionsBuilder {
  options: Omit<FindAndCountOptions<any>, 'group'>;
  constructor() {
    this.options = {
      where: {
        [Op.and]: [],
      },
    };
    return this;
  }
  limit(count?: number, ignorePaging?: boolean): QueryOptionsBuilder {
    if (count != null && (ignorePaging == null || ignorePaging == false))
      this.options.limit = count;
    return this;
  }
  offset(count?: number, ignorePaging?: boolean): QueryOptionsBuilder {
    if (count != null && (ignorePaging == null || ignorePaging == false))
      this.options.offset = count;
    return this;
  }
  order(order: { orderBy: string; sortOrder: string }): QueryOptionsBuilder {
    if (!this.options.order) this.options.order = [];
    const orders = JSON.parse(JSON.stringify(this.options.order));
    orders.push([order.orderBy, order.sortOrder]);
    this.options.order = orders;
    return this;
  }
  filter(condition: WhereOptions<any>): QueryOptionsBuilder {
    this.options.where[Op.and].push(condition);
    return this;
  }
  include(include: Includeable | Includeable[]): QueryOptionsBuilder {
    this.options.include = include;
    return this;
  }
  attributes(attributes: string[]): QueryOptionsBuilder {
    this.options.attributes = attributes;
    return this;
  }
  subQuery(flag: boolean) {
    this.options.subQuery = flag;
    return this;
  }
  build(): Omit<FindAndCountOptions<any>, 'group'> {
    return this.options;
  }
}
