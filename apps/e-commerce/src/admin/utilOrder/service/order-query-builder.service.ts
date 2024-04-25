import { Injectable } from '@nestjs/common';
import { User } from '@rahino/database/models/core/user.entity';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';
import { ECOrderDetailStatus } from '@rahino/database/models/ecommerce-eav/ec-order-detail-status.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { OrderStatusEnum } from '@rahino/ecommerce/util/enum';
import { Order } from '@rahino/query-filter';
import {
  IncludeOptionsBuilder,
  QueryOptionsBuilder,
} from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable({})
export class OrderQueryBuilder {
  private builder: QueryOptionsBuilder;
  constructor() {
    this.builder = new QueryOptionsBuilder();
    this.builder = this.builder.include([]);
  }

  nonDeletedOrder() {
    this.builder = this.builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    return this;
  }

  addOrderId(orderId: bigint) {
    this.builder = this.builder.filter({ id: orderId });
    return this;
  }

  addOrderStatus(status: OrderStatusEnum) {
    this.builder = this.builder.filter({
      orderStatusId: {
        [Op.eq]: status,
      },
    });
    return this;
  }

  addOnlyVendor(vendorId: number) {
    this.builder = this.builder.filter(
      Sequelize.literal(`EXISTS (
        SELECT 1
        FROM ECOrderDetails EOD
        WHERE EOD.orderId = ECOrder.id AND EOD.vendorId = ${vendorId}
      )`),
    );
    return this;
  }

  addOrderDetails(vendorId?: number) {
    let includeBuilder = new IncludeOptionsBuilder({
      model: ECOrderDetail,
      as: 'details',
      include: [
        {
          attributes: ['id', 'name', 'slug'],
          model: ECVendor,
          as: 'vendor',
        },
        {
          attributes: ['id', 'name'],
          model: ECOrderDetailStatus,
          as: 'orderDetailStatus',
        },
        {
          attributes: ['id', 'title', 'slug'],
          model: ECProduct,
          as: 'product',
        },
        {
          model: ECInventory,
          as: 'inventory',
          include: [
            {
              attributes: ['id', 'name', 'hexCode'],
              model: ECColor,
              as: 'color',
              required: false,
            },
            {
              attributes: ['id', 'name', 'slug'],
              model: ECGuarantee,
              as: 'guarantee',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: ECGuaranteeMonth,
              as: 'guaranteeMonth',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'name'],
          model: ECDiscount,
          as: 'discount',
        },
      ],
    });
    includeBuilder = includeBuilder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('details.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    if (vendorId) {
      includeBuilder = includeBuilder.filter({
        vendorId: vendorId,
      });
    }
    this.builder = this.builder.thenInlcude(includeBuilder.build());
    return this;
  }

  addAddress() {
    this.builder = this.builder.thenInlcude({
      model: ECAddress,
      as: 'address',
      include: [
        {
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'province',
        },
        {
          attributes: ['id', 'name'],
          model: ECCity,
          as: 'city',
        },
        {
          attributes: ['id', 'name'],
          model: ECNeighborhood,
          as: 'neighborhood',
        },
      ],
    });
    return this;
  }

  addUser() {
    this.builder = this.builder.thenInlcude({
      attributes: ['id', 'firstname', 'lastname', 'username', 'phoneNumber'],
      model: User,
      as: 'user',
    });
    return this;
  }

  offset(count: number) {
    this.builder = this.builder.offset(count);
    return this;
  }

  limit(count: number) {
    this.builder = this.builder.limit(count);
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
