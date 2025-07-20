import { Injectable, Scope } from '@nestjs/common';
import { Attachment } from '@rahino/database';
import { User } from '@rahino/database';
import { ECAddress } from '@rahino/localdatabase/models';
import { ECCity } from '@rahino/localdatabase/models';
import { ECColor } from '@rahino/localdatabase/models';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ECGuaranteeMonth } from '@rahino/localdatabase/models';
import { ECGuarantee } from '@rahino/localdatabase/models';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECNeighborhood } from '@rahino/localdatabase/models';
import { ECOrderDetailStatus } from '@rahino/localdatabase/models';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { ECOrderShipmentWay } from '@rahino/localdatabase/models';
import { ECOrderStatus } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { Order } from '@rahino/query-filter';
import {
  IncludeOptionsBuilder,
  QueryOptionsBuilder,
} from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable({ scope: Scope.REQUEST })
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

  deletedOrder() {
    this.builder = this.builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
        {
          [Op.eq]: 1,
        },
      ),
    );
    return this;
  }

  addOnlyUser(userId: bigint) {
    this.builder = this.builder.filter({ userId: userId });
    return this;
  }

  search(text: string) {
    this.builder = this.builder.filter({
      [Op.or]: [
        {
          transactionId: {
            [Op.like]: text,
          },
        },
        {
          id: {
            [Op.like]: text,
          },
        },
      ],
    });
    return this;
  }

  filterPhoneNumber(text: string) {
    this.builder = this.builder.filter(
      Sequelize.where(Sequelize.col('user.phoneNumber'), {
        [Op.like]: text,
      }),
    );
    return this;
  }

  filterOrderId(orderId: bigint) {
    this.builder = this.builder.filter({ id: orderId });
    return this;
  }

  subQuery(enable: boolean) {
    this.builder = this.builder.subQuery(enable);
    return this;
  }

  addOrderId(orderId: bigint) {
    this.builder = this.builder.filter({ id: orderId });
    return this;
  }

  orderShipmentWay(orderShipmentWay: OrderShipmentwayEnum) {
    this.builder = this.builder.filter({
      orderShipmentWayId: orderShipmentWay,
    });
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

  addNegativeOrderStatus(status: OrderStatusEnum) {
    this.builder = this.builder.filter({
      orderStatusId: {
        [Op.ne]: status,
      },
    });
    return this;
  }

  addOnlyVendor(vendors: number[]) {
    this.builder = this.builder.filter(
      Sequelize.literal(
        `EXISTS (
        SELECT 1
        FROM ECOrderDetails EOD
        WHERE EOD.orderId = ECOrder.id AND EOD.vendorId IN (${vendors.toString()})
      )`.replaceAll(/\s\s+/g, ' '),
      ),
    );
    return this;
  }

  addOnlyCourier(userId: bigint) {
    this.builder = this.builder.filter({ courierUserId: userId });
    return this;
  }

  includeAdminOrderDetails(vendors?: number[]) {
    let includeBuilder = new IncludeOptionsBuilder({
      model: ECOrderDetail,
      as: 'details',
      required: false,
      attributes: [
        'id',
        'orderId',
        'orderDetailStatusId',
        'vendorId',
        'productId',
        'inventoryId',
        'qty',
        'productPrice',
        'discountFee',
        'discountFeePerItem',
        'discountId',
        'totalPrice',
        'userId',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          attributes: ['id', 'name', 'slug'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: ECOrderDetailStatus,
          as: 'orderDetailStatus',
          required: false,
        },
        {
          attributes: ['id', 'title', 'slug', 'sku'],
          model: ECProduct,
          as: 'product',
          required: false,
          include: [
            {
              attributes: [
                'id',
                'colorId',
                'guaranteeId',
                'guaranteeMonthId',
                'description',
                'weight',
              ],
              model: ECInventory,
              as: 'inventories',
              required: false,
              where: Sequelize.where(Sequelize.col('details.inventoryId'), {
                [Op.eq]: Sequelize.col('details.product.inventories.id'),
              }),
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
              attributes: ['id', 'fileName'],
              through: {
                attributes: [],
              },
              model: Attachment,
              as: 'attachments',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'name'],
          model: ECDiscount,
          as: 'discount',
          required: false,
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
    if (vendors) {
      includeBuilder = includeBuilder.filter({
        vendorId: {
          [Op.in]: vendors,
        },
      });
    }
    this.builder = this.builder.thenInclude(includeBuilder.build());
    return this;
  }

  includeUserOrderDetails() {
    let includeBuilder = new IncludeOptionsBuilder({
      model: ECOrderDetail,
      as: 'details',
      required: false,
      attributes: [
        'id',
        'orderId',
        'orderDetailStatusId',
        'vendorId',
        'productId',
        'inventoryId',
        'qty',
        'productPrice',
        'discountFee',
        'discountFeePerItem',
        'discountId',
        'totalPrice',
        'userId',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          attributes: ['id', 'name', 'slug'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        },
        {
          attributes: ['id', 'title', 'slug', 'sku'],
          model: ECProduct,
          as: 'product',
          required: false,
          include: [
            {
              attributes: ['id', 'colorId', 'guaranteeId', 'guaranteeMonthId'],
              model: ECInventory,
              as: 'inventories',
              required: false,
              where: Sequelize.where(Sequelize.col('details.inventoryId'), {
                [Op.eq]: Sequelize.col('details.product.inventories.id'),
              }),
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
              attributes: ['id', 'fileName'],
              through: {
                attributes: [],
              },
              model: Attachment,
              as: 'attachments',
              required: false,
            },
          ],
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

    this.builder = this.builder.thenInclude(includeBuilder.build());
    return this;
  }

  includeAddress() {
    this.builder = this.builder.thenInclude({
      attributes: [
        'id',
        'name',
        'latitude',
        'longitude',
        'provinceId',
        'cityId',
        'neighborhoodId',
        'street',
        'alley',
        'plaque',
        'floorNumber',
        'postalCode',
      ],
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

  includeUser() {
    this.builder = this.builder.thenInclude({
      attributes: ['id', 'firstname', 'lastname', 'username', 'phoneNumber'],
      model: User,
      as: 'user',
      required: true,
    });
    return this;
  }

  includeOrderShipmentWay() {
    this.builder = this.builder.thenInclude({
      attributes: ['id', 'name'],
      model: ECOrderShipmentWay,
      as: 'orderShipmentWay',
    });
    return this;
  }

  includeOrderStatus() {
    this.builder = this.builder.thenInclude({
      attributes: ['id', 'name'],
      model: ECOrderStatus,
      as: 'orderStatus',
    });
    return this;
  }

  includePaymentGateway() {
    this.builder = this.builder.thenInclude({
      attributes: ['id', 'totalprice', 'paymentGatewayId'],
      model: ECPayment,
      as: 'payment',
      include: [
        {
          attributes: ['id', 'name'],
          model: ECPaymentGateway,
          as: 'paymentGateway',
        },
      ],
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
