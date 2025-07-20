import { Injectable, Scope } from '@nestjs/common';
import { Attachment } from '@rahino/database';
import { ECColor } from '@rahino/localdatabase/models';
import { ECGuaranteeMonth } from '@rahino/localdatabase/models';
import { ECGuarantee } from '@rahino/localdatabase/models';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';
import { Order } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { FindAttributeOptions, GroupOption, Op, Sequelize } from 'sequelize';

@Injectable({ scope: Scope.REQUEST })
export class SaleQueryBuilderService {
  private builder: QueryOptionsBuilder;
  private groupByQuery = false;
  constructor() {
    this.builder = new QueryOptionsBuilder();
    this.builder.include([]);
  }

  init(groupByQuery: boolean) {
    this.groupByQuery = groupByQuery;
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery ? [] : ['id', 'orderStatusId'],
      model: ECOrder,
      as: 'order',
      required: true,
    });
    return this;
  }

  nonDeleted() {
    this.builder = this.builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECOrderDetail.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    return this;
  }

  nonDeletedOrder() {
    this.builder = this.builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('order.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    return this;
  }

  onlyPaid() {
    this.builder = this.builder.filter(
      Sequelize.where(Sequelize.col('order.orderStatusId'), {
        [Op.ne]: OrderStatusEnum.WaitingForPayment,
      }),
    );
    return this;
  }

  addVariationPriceId(variationPriceId: number) {
    this.builder = this.builder.filter(
      Sequelize.where(Sequelize.col('inventoryPrice.variationPriceId'), {
        [Op.eq]: variationPriceId,
      }),
    );
    return this;
  }

  onlyVendor(vendorId: number) {
    this.builder = this.builder.filter({ vendorId: vendorId });
    return this;
  }

  addBeginDate(beginDate: string) {
    this.builder = this.builder.filter({
      gregorianAtPersian: {
        [Op.gte]: beginDate,
      },
    });
    return this;
  }

  addEndDate(endDate: string) {
    this.builder = this.builder.filter({
      gregorianAtPersian: {
        [Op.lt]: Sequelize.fn(
          'dateadd',
          Sequelize.literal('day'),
          Sequelize.literal('1'),
          endDate,
        ),
      },
    });
    return this;
  }

  attributes(attributes: FindAttributeOptions) {
    this.builder = this.builder.attributes(attributes);
    return this;
  }

  limit(limit: number) {
    this.builder = this.builder.limit(limit);
    return this;
  }

  offset(offset: number) {
    this.builder = this.builder.offset(offset);
    return this;
  }

  includeProduct() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery ? [] : ['id', 'title', 'sku'],
      model: ECProduct,
      as: 'product',
      required: false,
      include: [
        {
          attributes: this.groupByQuery ? [] : ['id', 'fileName'],
          through: {
            attributes: [],
          },
          model: Attachment,
          as: 'attachments',
          required: false,
        },
      ],
    });
    return this;
  }

  includeInventory() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery
        ? []
        : ['id', 'vendorId', 'colorId', 'guaranteeId', 'guaranteeMonthId'],
      model: ECInventory,
      as: 'inventory',
      required: false,
      include: [
        {
          attributes: this.groupByQuery ? [] : ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        },
        {
          attributes: this.groupByQuery ? [] : ['id', 'name'],
          model: ECColor,
          as: 'color',
          required: false,
        },
        {
          attributes: this.groupByQuery ? [] : ['id', 'name'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        },
        {
          attributes: this.groupByQuery ? [] : ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        },
      ],
    });
    return this;
  }

  includeVendor() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery ? [] : ['id', 'name', 'slug'],
      model: ECVendor,
      as: 'vendor',
      required: false,
    });
    return this;
  }

  includeInventoryPrice() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery
        ? []
        : ['id', 'buyPrice', 'variationPriceId'],
      model: ECInventoryPrice,
      as: 'inventoryPrice',
      required: true,
    });
    return this;
  }

  rawQuery(flag: boolean) {
    this.builder = this.builder.raw(flag);
    return this;
  }

  nest(flag: boolean) {
    this.builder = this.builder.nest(flag);
    return this;
  }

  group(group: GroupOption) {
    this.builder = this.builder.group(group);
    return this;
  }

  order(orderArg: Order) {
    this.builder = this.builder.order(orderArg);
    return this;
  }

  build() {
    return this.builder.build();
  }
}
