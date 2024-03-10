import {
  FindAndCountOptions,
  FindAttributeOptions,
  Includeable,
  LOCK,
  Op,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Order, OrderCol } from '@rahino/query-filter';

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
  order(orderArg: Order): QueryOptionsBuilder {
    if (!this.options.order) this.options.order = [];
    const orders = JSON.parse(JSON.stringify(this.options.order));
    if (isOrderCol(orderArg)) {
      const orderCol = orderArg as OrderCol;
      orders.push([orderCol.orderBy, orderCol.sortOrder]);
    } else {
      orders.push(orderArg);
    }

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
  attributes(attributes: FindAttributeOptions): QueryOptionsBuilder {
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
  transaction(transaction: Transaction) {
    this.options.transaction = transaction;
    return this;
  }
  lock(transactionLock: LOCK) {
    this.options.lock = transactionLock;
    return this;
  }
  thenInlcude(include: Includeable) {
    const included = this.options.include as Includeable[];
    included.push(include);
    return this;
  }
}

function isOrderCol(x: any) {
  return 'orderBy' in x;
}
