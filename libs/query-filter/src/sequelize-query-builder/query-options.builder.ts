import { FindAndCountOptions, Includeable, Op, WhereOptions } from 'sequelize';

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
  limit(count?: number): QueryOptionsBulder {
    if (count) this.options.limit = count;
    return this;
  }
  offset(count?: number): QueryOptionsBulder {
    if (count) this.options.offset = count;
    return this;
  }
  order(order: { orderBy: string; sortOrder: string }): QueryOptionsBulder {
    if (!this.options.order) this.options.order = [];
    const orders = JSON.parse(JSON.stringify(this.options.order));
    orders.push([order.orderBy, order.sortOrder]);
    this.options.order = orders;
    return this;
  }
  filter(condition: WhereOptions<any>): QueryOptionsBulder {
    this.options.where[Op.and].push(condition);
    return this;
  }
  include(include: Includeable | Includeable[]): QueryOptionsBulder {
    this.options.include = include;
    return this;
  }
  attributes(attributes: string[]): QueryOptionsBulder {
    this.options.attributes = attributes;
    return this;
  }
  build(): Omit<FindAndCountOptions<any>, 'group'> {
    return this.options;
  }
}
