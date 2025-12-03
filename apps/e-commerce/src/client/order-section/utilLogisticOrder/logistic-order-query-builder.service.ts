import { Injectable, Scope } from '@nestjs/common';
import { Attachment, User } from '@rahino/database';
import {
  ECAddress,
  ECCity,
  ECColor,
  ECDiscount,
  ECGuarantee,
  ECGuaranteeMonth,
  ECInventory,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECLogistic,
  ECLogisticShipmentWay,
  ECLogisticSendingPeriod,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
  ECNeighborhood,
  ECOrderStatus,
  ECPayment,
  ECProduct,
  ECProvince,
  ECOrderShipmentWay,
  ECScheduleSendingType,
  ECVendor,
} from '@rahino/localdatabase/models';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';
import { Order, SortOrder } from '@rahino/query-filter';
import {
  IncludeOptionsBuilder,
  QueryOptionsBuilder,
} from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable({ scope: Scope.REQUEST })
export class LogisticOrderQueryBuilder {
  private builder: QueryOptionsBuilder;
  constructor() {
    this.builder = new QueryOptionsBuilder();
    this.builder = this.builder.include([]);
  }

  subQuery(enable: boolean) {
    this.builder = this.builder.subQuery(enable);
    return this;
  }

  nonDeletedOrder() {
    this.builder = this.builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECLogisticOrder.isDeleted'), 0),
        { [Op.eq]: 0 },
      ),
    );
    return this;
  }

  addOnlyUser(userId: bigint) {
    this.builder = this.builder.filter({ userId });
    return this;
  }

  addOrderId(orderId: bigint) {
    this.builder = this.builder.filter({ id: orderId });
    return this;
  }

  addNegativeOrderStatus(status: OrderStatusEnum) {
    this.builder = this.builder.filter({
      orderStatusId: { [Op.ne]: status },
    });
    return this;
  }

  search(text?: string) {
    if (!text) return this;
    this.builder = this.builder.filter({
      [Op.or]: [
        { transactionId: { [Op.like]: text } },
        { id: { [Op.like]: text } },
        // {
        //   '$user.phoneNumber$': {
        //     [Op.like]: text,
        //   },
        // },
      ],
    });
    return this;
  }

  order(params: { orderBy?: string; sortOrder?: SortOrder | string }) {
    const orderBy = params?.orderBy;
    const sortOrder = (params?.sortOrder as string) ?? undefined;
    // If no orderBy is provided, skip applying ordering to avoid underlying
    // query builder attempts to push into an undefined order array.
    if (!orderBy) {
      return this;
    }
    this.builder = this.builder.order({ orderBy, sortOrder });
    return this;
  }

  offset(offset?: number) {
    this.builder = this.builder.offset(offset);
    return this;
  }

  limit(limit?: number) {
    this.builder = this.builder.limit(limit);
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

  includePayment() {
    this.builder = this.builder.thenInclude({
      attributes: ['id', 'paymentGatewayId', 'totalprice'],
      model: ECPayment,
      as: 'payment',
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
        { attributes: ['id', 'name'], model: ECProvince, as: 'province' },
        { attributes: ['id', 'name'], model: ECCity, as: 'city' },
        {
          attributes: ['id', 'name'],
          model: ECNeighborhood,
          as: 'neighborhood',
        },
      ],
    });
    return this;
  }

  includeGroupsAndDetails() {
    // groups
    let groupsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGrouped,
      as: 'groups',
      required: false,
      attributes: [
        'id',
        'logisticId',
        'logisticShipmentWayId',
        'orderShipmentWayId',
        'logisticSendingPeriodId',
        'logisticWeeklyPeriodId',
        'logisticWeeklyPeriodTimeId',
        'sendingGregorianDate',
        'orderStatusId',
        'totalProductPrice',
        'totalDiscountFee',
        'shipmentPrice',
        'realShipmentPrice',
        'totalPrice',
        // new tracking fields
        'courierUserId',
        'postReceipt',
        'deliveryDate',
        'sendToCustomerDate',
        'sendToCustomerBy',
      ],
      include: [
        {
          attributes: ['id', 'name'],
          model: ECOrderStatus,
          as: 'orderStatus',
          required: false,
        },
        // logistic
        {
          attributes: ['id', 'title'],
          model: ECLogistic,
          as: 'logistic',
          required: false,
        },
        // logistic shipment way and its lookups
        {
          attributes: ['id', 'logisticId', 'orderShipmentWayId', 'provinceId'],
          model: ECLogisticShipmentWay,
          as: 'logisticShipmentWay',
          required: false,
          include: [
            {
              attributes: ['id', 'name', 'icon'],
              model: ECOrderShipmentWay,
              as: 'orderShipmentWay',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: ECProvince,
              as: 'province',
              required: false,
            },
          ],
        },
        // logistic sending period and its lookups
        {
          attributes: [
            'id',
            'logisticShipmentWayId',
            'scheduleSendingTypeId',
            'startDate',
            'endDate',
          ],
          model: ECLogisticSendingPeriod,
          as: 'logisticSendingPeriod',
          required: false,
          include: [
            {
              attributes: ['id', 'title', 'icon'],
              model: ECScheduleSendingType,
              as: 'scheduleSendingType',
              required: false,
            },
          ],
        },
        // weekly period
        {
          attributes: ['id', 'logisticSendingPeriodId', 'weekNumber'],
          model: ECLogisticWeeklyPeriod,
          as: 'logisticWeeklyPeriod',
          required: false,
        },
        // weekly period time
        {
          attributes: ['id', 'logisticWeeklyPeriodId', 'startTime', 'endTime'],
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTime',
          required: false,
        },
      ],
    });

    // details under groups
    const detailsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGroupedDetail,
      as: 'details',
      required: false,
      attributes: [
        'id',
        'groupedId',
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
              where: Sequelize.where(
                Sequelize.col('groups.details.inventoryId'),
                {
                  [Op.eq]: Sequelize.col(
                    'groups.details.product.inventories.id',
                  ),
                },
              ),
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
              through: { attributes: [] },
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

    groupsInclude = groupsInclude
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('groups.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .thenInclude(detailsInclude.build());

    this.builder = this.builder.thenInclude(groupsInclude.build());
    return this;
  }

  // Include groups and details but restrict details to specific vendor IDs and statuses
  includeGroupsAndDetailsVendorAndStatusRestricted(
    vendorIds: number[],
    statuses?: number[],
  ) {
    const vIds = vendorIds && vendorIds.length ? vendorIds : [-1];
    const sIds = statuses && statuses.length ? statuses : [];

    // groups
    let groupsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGrouped,
      as: 'groups',
      required: false,
      attributes: [
        'id',
        'logisticId',
        'logisticShipmentWayId',
        'orderShipmentWayId',
        'logisticSendingPeriodId',
        'logisticWeeklyPeriodId',
        'logisticWeeklyPeriodTimeId',
        'sendingGregorianDate',
        'orderStatusId',
        'totalProductPrice',
        'totalDiscountFee',
        'shipmentPrice',
        'realShipmentPrice',
        'totalPrice',
        'courierUserId',
        'postReceipt',
        'deliveryDate',
        'sendToCustomerDate',
        'sendToCustomerBy',
      ],
      include: [
        {
          attributes: ['id', 'name'],
          model: ECOrderStatus,
          as: 'orderStatus',
          required: false,
        },
        {
          attributes: ['id', 'title'],
          model: ECLogistic,
          as: 'logistic',
          required: false,
        },
        {
          attributes: ['id', 'logisticId', 'orderShipmentWayId', 'provinceId'],
          model: ECLogisticShipmentWay,
          as: 'logisticShipmentWay',
          required: false,
          include: [
            {
              attributes: ['id', 'name', 'icon'],
              model: ECOrderShipmentWay,
              as: 'orderShipmentWay',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: ECProvince,
              as: 'province',
              required: false,
            },
          ],
        },
        {
          attributes: [
            'id',
            'logisticShipmentWayId',
            'scheduleSendingTypeId',
            'startDate',
            'endDate',
          ],
          model: ECLogisticSendingPeriod,
          as: 'logisticSendingPeriod',
          required: false,
          include: [
            {
              attributes: ['id', 'title', 'icon'],
              model: ECScheduleSendingType,
              as: 'scheduleSendingType',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'logisticSendingPeriodId', 'weekNumber'],
          model: ECLogisticWeeklyPeriod,
          as: 'logisticWeeklyPeriod',
          required: false,
        },
        {
          attributes: ['id', 'logisticWeeklyPeriodId', 'startTime', 'endTime'],
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTime',
          required: false,
        },
      ],
    });

    // details under groups, filtered by vendor, status and non-deleted
    let detailsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGroupedDetail,
      as: 'details',
      required: true,
      attributes: [
        'id',
        'groupedId',
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
              where: Sequelize.where(
                Sequelize.col('groups.details.inventoryId'),
                {
                  [Op.eq]: Sequelize.col(
                    'groups.details.product.inventories.id',
                  ),
                },
              ),
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
              through: { attributes: [] },
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

    detailsInclude = detailsInclude.filter({
      [Op.or]: [{ isDeleted: null }, { isDeleted: false }, { isDeleted: 0 }],
    });
    detailsInclude = detailsInclude.filter({ vendorId: { [Op.in]: vIds } });
    detailsInclude = detailsInclude.filterIf(sIds.length > 0, {
      orderDetailStatusId: { [Op.in]: sIds },
    });

    groupsInclude = groupsInclude
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('groups.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .thenInclude(detailsInclude.build());

    this.builder = this.builder.thenInclude(groupsInclude.build());
    return this;
  }

  // Include groups and details but restrict details to specific vendor IDs
  includeGroupsAndDetailsVendorRestricted(vendorIds: number[]) {
    const ids = vendorIds && vendorIds.length ? vendorIds : [-1];

    // groups
    let groupsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGrouped,
      as: 'groups',
      required: false,
      attributes: [
        'id',
        'logisticId',
        'logisticShipmentWayId',
        'orderShipmentWayId',
        'logisticSendingPeriodId',
        'logisticWeeklyPeriodId',
        'logisticWeeklyPeriodTimeId',
        'sendingGregorianDate',
        'orderStatusId',
        'totalProductPrice',
        'totalDiscountFee',
        'shipmentPrice',
        'realShipmentPrice',
        'totalPrice',
        // new tracking fields
        'courierUserId',
        'postReceipt',
        'deliveryDate',
        'sendToCustomerDate',
        'sendToCustomerBy',
      ],
      include: [
        {
          attributes: ['id', 'name'],
          model: ECOrderStatus,
          as: 'orderStatus',
          required: false,
        },
        // logistic
        {
          attributes: ['id', 'title'],
          model: ECLogistic,
          as: 'logistic',
          required: false,
        },
        // logistic shipment way and its lookups
        {
          attributes: ['id', 'logisticId', 'orderShipmentWayId', 'provinceId'],
          model: ECLogisticShipmentWay,
          as: 'logisticShipmentWay',
          required: false,
          include: [
            {
              attributes: ['id', 'name', 'icon'],
              model: ECOrderShipmentWay,
              as: 'orderShipmentWay',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: ECProvince,
              as: 'province',
              required: false,
            },
          ],
        },
        // logistic sending period and its lookups
        {
          attributes: [
            'id',
            'logisticShipmentWayId',
            'scheduleSendingTypeId',
            'startDate',
            'endDate',
          ],
          model: ECLogisticSendingPeriod,
          as: 'logisticSendingPeriod',
          required: false,
          include: [
            {
              attributes: ['id', 'title', 'icon'],
              model: ECScheduleSendingType,
              as: 'scheduleSendingType',
              required: false,
            },
          ],
        },
        // weekly period
        {
          attributes: ['id', 'logisticSendingPeriodId', 'weekNumber'],
          model: ECLogisticWeeklyPeriod,
          as: 'logisticWeeklyPeriod',
          required: false,
        },
        // weekly period time
        {
          attributes: ['id', 'logisticWeeklyPeriodId', 'startTime', 'endTime'],
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTime',
          required: false,
        },
      ],
    });

    // details under groups, filtered by vendor and non-deleted
    let detailsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGroupedDetail,
      as: 'details',
      required: true,
      attributes: [
        'id',
        'groupedId',
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
              where: Sequelize.where(
                Sequelize.col('groups.details.inventoryId'),
                {
                  [Op.eq]: Sequelize.col(
                    'groups.details.product.inventories.id',
                  ),
                },
              ),
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
              through: { attributes: [] },
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

    detailsInclude = detailsInclude.filter({
      [Op.or]: [
        { isDeleted: null },
        { isDeleted: false as any },
        { isDeleted: 0 as any },
      ],
    });
    detailsInclude = detailsInclude.filter({
      vendorId: { [Op.in]: ids },
    });

    groupsInclude = groupsInclude.thenInclude(detailsInclude.build());
    this.builder = this.builder.thenInclude(groupsInclude.build());
    return this;
  }

  // Include groups and details but restrict groups to specific logistics (by IDs)
  includeGroupsAndDetailsRestricted(logisticIds: number[]) {
    const ids = (
      logisticIds && logisticIds.length ? logisticIds : [-1]
    ) as any[];

    // groups
    let groupsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGrouped,
      as: 'groups',
      required: false,
      attributes: [
        'id',
        'logisticId',
        'logisticShipmentWayId',
        'orderShipmentWayId',
        'logisticSendingPeriodId',
        'logisticWeeklyPeriodId',
        'logisticWeeklyPeriodTimeId',
        'sendingGregorianDate',
        'orderStatusId',
        'totalProductPrice',
        'totalDiscountFee',
        'shipmentPrice',
        'realShipmentPrice',
        'totalPrice',
        // new tracking fields
        'courierUserId',
        'postReceipt',
        'deliveryDate',
        'sendToCustomerDate',
        'sendToCustomerBy',
      ],
      where: {
        logisticId: { [Op.in]: ids },
      },
      include: [
        {
          attributes: ['id', 'name'],
          model: ECOrderStatus,
          as: 'orderStatus',
          required: false,
        },
        // logistic
        {
          attributes: ['id', 'title'],
          model: ECLogistic,
          as: 'logistic',
          required: false,
        },
        // logistic shipment way and its lookups
        {
          attributes: ['id', 'logisticId', 'orderShipmentWayId', 'provinceId'],
          model: ECLogisticShipmentWay,
          as: 'logisticShipmentWay',
          required: false,
          include: [
            {
              attributes: ['id', 'name', 'icon'],
              model: ECOrderShipmentWay,
              as: 'orderShipmentWay',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: ECProvince,
              as: 'province',
              required: false,
            },
          ],
        },
        // logistic sending period and its lookups
        {
          attributes: [
            'id',
            'logisticShipmentWayId',
            'scheduleSendingTypeId',
            'startDate',
            'endDate',
          ],
          model: ECLogisticSendingPeriod,
          as: 'logisticSendingPeriod',
          required: false,
          include: [
            {
              attributes: ['id', 'title', 'icon'],
              model: ECScheduleSendingType,
              as: 'scheduleSendingType',
              required: false,
            },
          ],
        },
        // weekly period
        {
          attributes: ['id', 'logisticSendingPeriodId', 'weekNumber'],
          model: ECLogisticWeeklyPeriod,
          as: 'logisticWeeklyPeriod',
          required: false,
        },
        // weekly period time
        {
          attributes: ['id', 'logisticWeeklyPeriodId', 'startTime', 'endTime'],
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTime',
          required: false,
        },
      ],
    });

    // details under groups
    let detailsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGroupedDetail,
      as: 'details',
      required: false,
      attributes: [
        'id',
        'groupedId',
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
              where: Sequelize.where(
                Sequelize.col('groups.details.inventoryId'),
                {
                  [Op.eq]: Sequelize.col(
                    'groups.details.product.inventories.id',
                  ),
                },
              ),
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
              through: { attributes: [] },
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

    detailsInclude = detailsInclude.filter({
      [Op.or]: [
        { isDeleted: null },
        { isDeleted: false as any },
        { isDeleted: 0 as any },
      ],
    });

    groupsInclude = groupsInclude
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('groups.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .thenInclude(detailsInclude.build());
    this.builder = this.builder.thenInclude(groupsInclude.build());
    return this;
  }

  // Include groups and details but restrict groups by logistic, status, shipment way, and courier assignment
  includeGroupsAndDetailsGroupFiltered(params: {
    logisticIds?: number[];
    orderStatusIds?: number[];
    orderShipmentWayId?: number;
    courierUserId?: number | bigint;
  }) {
    // groups
    let groupsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGrouped,
      as: 'groups',
      required: false,
      attributes: [
        'id',
        'logisticId',
        'logisticShipmentWayId',
        'orderShipmentWayId',
        'logisticSendingPeriodId',
        'logisticWeeklyPeriodId',
        'logisticWeeklyPeriodTimeId',
        'sendingGregorianDate',
        'orderStatusId',
        'totalProductPrice',
        'totalDiscountFee',
        'shipmentPrice',
        'realShipmentPrice',
        'totalPrice',
        'courierUserId',
        'postReceipt',
        'deliveryDate',
        'sendToCustomerDate',
        'sendToCustomerBy',
      ],
      include: [
        {
          attributes: ['id', 'name'],
          model: ECOrderStatus,
          as: 'orderStatus',
          required: false,
        },
        {
          attributes: ['id', 'title'],
          model: ECLogistic,
          as: 'logistic',
          required: false,
        },
        {
          attributes: ['id', 'logisticId', 'orderShipmentWayId', 'provinceId'],
          model: ECLogisticShipmentWay,
          as: 'logisticShipmentWay',
          required: false,
          include: [
            {
              attributes: ['id', 'name', 'icon'],
              model: ECOrderShipmentWay,
              as: 'orderShipmentWay',
              required: false,
            },
            {
              attributes: ['id', 'name'],
              model: ECProvince,
              as: 'province',
              required: false,
            },
          ],
        },
        {
          attributes: [
            'id',
            'logisticShipmentWayId',
            'scheduleSendingTypeId',
            'startDate',
            'endDate',
          ],
          model: ECLogisticSendingPeriod,
          as: 'logisticSendingPeriod',
          required: false,
          include: [
            {
              attributes: ['id', 'title', 'icon'],
              model: ECScheduleSendingType,
              as: 'scheduleSendingType',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'logisticSendingPeriodId', 'weekNumber'],
          model: ECLogisticWeeklyPeriod,
          as: 'logisticWeeklyPeriod',
          required: false,
        },
        {
          attributes: ['id', 'logisticWeeklyPeriodId', 'startTime', 'endTime'],
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTime',
          required: false,
        },
      ],
    });
    // apply group-level filters using IncludeOptionsBuilder's [Op.and] pipeline
    groupsInclude = groupsInclude
      .filterIf(!!(params?.logisticIds && params.logisticIds.length), {
        logisticId: { [Op.in]: (params?.logisticIds || []) as any[] },
      })
      .filterIf(!!(params?.orderStatusIds && params.orderStatusIds.length), {
        orderStatusId: { [Op.in]: (params?.orderStatusIds || []) as any[] },
      })
      .filterIf(params?.orderShipmentWayId !== undefined, {
        orderShipmentWayId: params?.orderShipmentWayId as any,
      })
      .filterIf(params?.courierUserId !== undefined, {
        courierUserId: params?.courierUserId as any,
      });

    // details under groups; exclude deleted
    let detailsInclude = new IncludeOptionsBuilder({
      model: ECLogisticOrderGroupedDetail,
      as: 'details',
      required: false,
      attributes: [
        'id',
        'groupedId',
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
              where: Sequelize.where(
                Sequelize.col('groups.details.inventoryId'),
                {
                  [Op.eq]: Sequelize.col(
                    'groups.details.product.inventories.id',
                  ),
                },
              ),
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
              through: { attributes: [] },
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

    detailsInclude = detailsInclude.filter({
      [Op.or]: [
        { isDeleted: null },
        { isDeleted: false as any },
        { isDeleted: 0 as any },
      ],
    });

    groupsInclude = groupsInclude
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('groups.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .thenInclude(detailsInclude.build());

    this.builder = this.builder.thenInclude(groupsInclude.build());
    return this;
  }

  filter(condition: any) {
    this.builder = this.builder.filter(condition);
    return this;
  }

  build() {
    return this.builder.build();
  }
}
