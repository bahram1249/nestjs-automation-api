import {
  BindOrReplacements,
  FindAndCountOptions,
  FindAttributeOptions,
  GroupOption,
  Includeable,
  LOCK,
  Op,
  OrderItem,
  literal,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Order, OrderCol } from '@rahino/query-filter';
import { isNotNull, isNotNullOrEmpty } from '@rahino/commontools';

export class QueryOptionsBuilder {
  options: FindAndCountOptions<any>;
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
  order(orderArg: Order | []): QueryOptionsBuilder {
    if (!this.options.order) this.options.order = [];
    const orders = this.options.order as OrderItem[];
    if (isOrderCol(orderArg)) {
      const orderCol = orderArg as OrderCol;
      const ob = orderCol.orderBy as any;
      if (typeof ob === 'string' && ob.includes('.')) {
        // Handle dotted paths like "ECLogisticOrder.id" reliably across dialects
        orders.push([literal(ob), orderCol.sortOrder]);
      } else {
        orders.push([orderCol.orderBy, orderCol.sortOrder]);
      }
    } else if (isNotNull(orderArg)) {
      if (!(Array.isArray(orderArg) && orderArg.length == 0))
        orders.push(orderArg as OrderItem);
    }

    this.options.order = orders;
    return this;
  }
  filter(condition: WhereOptions<any>): QueryOptionsBuilder {
    this.options.where[Op.and].push(condition);
    return this;
  }

  filterIf(
    condition: boolean,
    queryCondition: WhereOptions<any>,
  ): QueryOptionsBuilder {
    if (condition) this.options.where[Op.and].push(queryCondition);
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
  build(): FindAndCountOptions<any> {
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
  thenInclude(include: Includeable) {
    const included = this.options.include as Includeable[];
    included.push(include);
    return this;
  }

  thenIncludeIf(condition: boolean, include: Includeable) {
    if (condition) {
      const included = this.options.include as Includeable[];
      included.push(include);
    }
    return this;
  }

  replacements(replacements: BindOrReplacements) {
    this.options.replacements = replacements;
    return this;
  }

  group(group: GroupOption) {
    this.options.group = group;
    return this;
  }
  raw(flag: boolean) {
    this.options.raw = flag;
    return this;
  }

  nest(flag: boolean) {
    this.options.nest = flag;
    return this;
  }
}

function isOrderCol(x: any) {
  return 'orderBy' in x;
}
