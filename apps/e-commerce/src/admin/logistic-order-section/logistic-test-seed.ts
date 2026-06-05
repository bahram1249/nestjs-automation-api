import {
  ECLogistic,
  ECLogisticShipmentWay,
  ECLogisticUser,
  ECBrand,
  ECVendor,
  ECVendorUser,
  ECAddress,
  ECVendorAddress,
  ECProduct,
  ECInventory,
  ECInventoryPrice,
  ECPublishStatus,
  ECInventoryStatus,
  ECVariationPrice,
  EAVEntityType,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECCourier,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import {
  OrderStatusEnum,
  OrderShipmentwayEnum,
  OrderDetailStatusEnum,
} from '@rahino/ecommerce/shared/enum';

export interface SeedIds {
  logisticId: number;
  logisticShipmentWayPostId: number;
  logisticShipmentWayDeliveryId: number;
  brandId: number;
  vendorId: number;
  addressId: number;
  vendorAddressId: number;
  entityTypeId: number;
  productId: number;
  inventoryId: number;
  inventoryPriceId: number;
}

export async function seedBase(): Promise<SeedIds> {
  const testUser = await User.findOne({ where: { id: 1 } });
  if (!testUser) throw new Error('User id=1 not seeded');

  const publishStatus = await ECPublishStatus.findOne({ where: { id: 1 } });
  if (!publishStatus) throw new Error('ECPublishStatus id=1 not found');

  const inventoryStatus = await ECInventoryStatus.findOne({ where: { id: 1 } });
  if (!inventoryStatus) throw new Error('ECInventoryStatus id=1 not found');

  const variationPrice = await ECVariationPrice.findOne({ where: { id: 2 } });
  if (!variationPrice) throw new Error('ECVariationPrice id=2 not found');

  let entityType = await EAVEntityType.findOne({
    where: { entityModelId: 1 },
  });
  if (!entityType) {
    entityType = await EAVEntityType.create({
      name: 'Test Logistic Product Type',
      slug: 'test-logistic-product-type',
      entityModelId: 1,
    } as any);
  }
  const entityTypeId = Number(entityType.id);

  const logistic = await ECLogistic.create({
    title: 'Test Logistic',
  } as any);
  const logisticId = Number(logistic.id);

  const postWay = await ECLogisticShipmentWay.create({
    logisticId: Number(logistic.id),
    orderShipmentWayId: OrderShipmentwayEnum.post,
  } as any);
  const logisticShipmentWayPostId = Number(postWay.id);

  const deliveryWay = await ECLogisticShipmentWay.create({
    logisticId: Number(logistic.id),
    orderShipmentWayId: OrderShipmentwayEnum.delivery,
  } as any);
  const logisticShipmentWayDeliveryId = Number(deliveryWay.id);

  await ECLogisticUser.create({
    logisticId: Number(logistic.id),
    userId: 1,
  } as any);

  const brand = await ECBrand.create({
    name: 'Test Logistic Brand',
    slug: 'test-logistic-brand-' + Date.now(),
  } as any);
  const brandId = Number(brand.id);

  const vendor = await ECVendor.create({
    name: 'Test Logistic Vendor',
    slug: 'test-logistic-vendor-' + Date.now(),
    userId: 1,
  } as any);
  const vendorId = Number(vendor.id);

  await ECVendorUser.create({
    vendorId: Number(vendor.id),
    userId: 1,
  } as any);

  const address = await ECAddress.create({
    name: 'Test Logistic Address',
    latitude: '35.6892',
    longitude: '51.3890',
    provinceId: 1,
    cityId: 1,
  } as any);
  const addressId = Number(address.id);

  const vendorAddress = await ECVendorAddress.create({
    vendorId: Number(vendor.id),
    addressId: Number(address.id),
    userId: 1,
  } as any);
  const vendorAddressId = Number(vendorAddress.id);

  const now = Date.now();
  const product = await ECProduct.create({
    id: -now,
    title: 'Test Logistic Product',
    slug: 'test-logistic-product-' + now,
    sku: 'LOG-' + now,
    entityTypeId: entityType.id,
    brandId: brand.id,
    publishStatusId: 1,
    inventoryStatusId: 1,
    userId: 1,
    viewCount: 0,
  } as any);
  const productId = Number(product.id);

  const inventory = await ECInventory.create({
    productId: Number(product.id),
    vendorId: Number(vendor.id),
    qty: 10,
    vendorAddressId: Number(vendorAddress.id),
    inventoryStatusId: 1,
    userId: 1,
  } as any);
  const inventoryId = Number(inventory.id);

  const invPrice = await ECInventoryPrice.create({
    inventoryId: Number(inventory.id),
    variationPriceId: 2,
    price: 100000,
    userId: 1,
  } as any);
  const inventoryPriceId = Number(invPrice.id);

  return {
    logisticId,
    logisticShipmentWayPostId,
    logisticShipmentWayDeliveryId,
    brandId,
    vendorId,
    addressId,
    vendorAddressId,
    entityTypeId,
    productId,
    inventoryId,
    inventoryPriceId,
  };
}

export async function seedCancellOrder(
  ids: SeedIds,
): Promise<{ logisticOrderId: number }> {
  const order = await ECLogisticOrder.create({
    orderStatusId: OrderStatusEnum.Paid,
    sessionId: 'test-session-cancell',
    userId: 1,
    addressId: ids.addressId,
    isDeleted: true,
  } as any);
  const logisticOrderId = Number(order.id);

  await ECLogisticOrderGrouped.create({
    logisticOrderId: Number(order.id),
    logisticId: ids.logisticId,
    logisticShipmentWayId: ids.logisticShipmentWayDeliveryId,
    orderStatusId: OrderStatusEnum.Paid,
    orderShipmentWayId: OrderShipmentwayEnum.delivery,
  } as any);

  return { logisticOrderId };
}

export async function seedCourierOrder(
  ids: SeedIds,
): Promise<{ logisticOrderId: number; groupedId: number }> {
  const order = await ECLogisticOrder.create({
    orderStatusId: OrderStatusEnum.OrderHasBeenProcessed,
    sessionId: 'test-session-courier',
    userId: 1,
    addressId: ids.addressId,
    isDeleted: false,
  } as any);
  const logisticOrderId = Number(order.id);

  const group = await ECLogisticOrderGrouped.create({
    logisticOrderId: Number(order.id),
    logisticId: ids.logisticId,
    logisticShipmentWayId: ids.logisticShipmentWayDeliveryId,
    orderStatusId: OrderStatusEnum.OrderHasBeenProcessed,
    orderShipmentWayId: OrderShipmentwayEnum.delivery,
  } as any);
  const groupedId = Number(group.id);

  return { logisticOrderId, groupedId };
}

export async function seedDeliveryOrder(
  ids: SeedIds,
): Promise<{ logisticOrderId: number; groupedId: number }> {
  const order = await ECLogisticOrder.create({
    orderStatusId: OrderStatusEnum.SendByCourier,
    sessionId: 'test-session-delivery',
    userId: 1,
    addressId: ids.addressId,
    isDeleted: false,
  } as any);
  const logisticOrderId = Number(order.id);

  const group = await ECLogisticOrderGrouped.create({
    logisticOrderId: Number(order.id),
    logisticId: ids.logisticId,
    logisticShipmentWayId: ids.logisticShipmentWayDeliveryId,
    orderStatusId: OrderStatusEnum.SendByCourier,
    orderShipmentWayId: OrderShipmentwayEnum.delivery,
    courierUserId: 1,
  } as any);
  const groupedId = Number(group.id);

  return { logisticOrderId, groupedId };
}

export async function seedPendingOrder(
  ids: SeedIds,
): Promise<{ logisticOrderId: number; groupedId: number; detailId: number }> {
  const order = await ECLogisticOrder.create({
    orderStatusId: OrderStatusEnum.Paid,
    sessionId: 'test-session-pending',
    userId: 1,
    addressId: ids.addressId,
    isDeleted: false,
  } as any);
  const logisticOrderId = Number(order.id);

  const group = await ECLogisticOrderGrouped.create({
    logisticOrderId: Number(order.id),
    logisticId: ids.logisticId,
    logisticShipmentWayId: ids.logisticShipmentWayDeliveryId,
    orderStatusId: OrderStatusEnum.Paid,
    orderShipmentWayId: OrderShipmentwayEnum.delivery,
  } as any);
  const groupedId = Number(group.id);

  const detail = await ECLogisticOrderGroupedDetail.create({
    groupedId: Number(group.id),
    orderDetailStatusId: OrderDetailStatusEnum.WaitingForProcess,
    vendorId: ids.vendorId,
    productId: ids.productId,
    inventoryId: ids.inventoryId,
    inventoryPriceId: ids.inventoryPriceId,
    qty: 2,
    productPrice: 100000,
    totalPrice: 200000,
  } as any);
  const detailId = Number(detail.id);

  return { logisticOrderId, groupedId, detailId };
}

export async function seedPostageOrder(
  ids: SeedIds,
): Promise<{ logisticOrderId: number; groupedId: number }> {
  const order = await ECLogisticOrder.create({
    orderStatusId: OrderStatusEnum.OrderHasBeenProcessed,
    sessionId: 'test-session-postage',
    userId: 1,
    addressId: ids.addressId,
    isDeleted: false,
  } as any);
  const logisticOrderId = Number(order.id);

  const group = await ECLogisticOrderGrouped.create({
    logisticOrderId: Number(order.id),
    logisticId: ids.logisticId,
    logisticShipmentWayId: ids.logisticShipmentWayPostId,
    orderStatusId: OrderStatusEnum.OrderHasBeenProcessed,
    orderShipmentWayId: OrderShipmentwayEnum.post,
  } as any);
  const groupedId = Number(group.id);

  return { logisticOrderId, groupedId };
}

export async function seedTotalOrder(
  ids: SeedIds,
): Promise<{ logisticOrderId: number; groupedId: number; detailId: number }> {
  const order = await ECLogisticOrder.create({
    orderStatusId: OrderStatusEnum.Paid,
    sessionId: 'test-session-total',
    userId: 1,
    addressId: ids.addressId,
    isDeleted: false,
    totalProductPrice: 100000,
    totalPrice: 100000,
  } as any);
  const logisticOrderId = Number(order.id);

  const group = await ECLogisticOrderGrouped.create({
    logisticOrderId: Number(order.id),
    logisticId: ids.logisticId,
    logisticShipmentWayId: ids.logisticShipmentWayDeliveryId,
    orderStatusId: OrderStatusEnum.Paid,
    orderShipmentWayId: OrderShipmentwayEnum.delivery,
    totalProductPrice: 100000,
    totalPrice: 100000,
  } as any);
  const groupedId = Number(group.id);

  const detail = await ECLogisticOrderGroupedDetail.create({
    groupedId: Number(group.id),
    orderDetailStatusId: OrderDetailStatusEnum.Processed,
    vendorId: ids.vendorId,
    productId: ids.productId,
    inventoryId: ids.inventoryId,
    inventoryPriceId: ids.inventoryPriceId,
    qty: 1,
    productPrice: 100000,
    totalPrice: 100000,
  } as any);
  const detailId = Number(detail.id);

  return { logisticOrderId, groupedId, detailId };
}

export async function seedCourier(userId: number): Promise<number> {
  const courier = await ECCourier.create({
    userId,
  } as any);
  return Number(courier.id);
}

export async function cleanupOrderData(orderIds: number[]): Promise<void> {
  for (const id of orderIds) {
    const groups = await ECLogisticOrderGrouped.findAll({
      where: { logisticOrderId: id },
      paranoid: false,
    });
    for (const g of groups) {
      try {
        await ECLogisticOrderGroupedDetail.destroy({
          where: { groupedId: Number(g.id) },
          force: true,
        });
      } catch {}
    }
    try {
      await ECLogisticOrderGrouped.destroy({
        where: { logisticOrderId: id },
        force: true,
      });
    } catch {}
    try {
      await ECLogisticOrder.destroy({ where: { id }, force: true });
    } catch {}
  }
}

export async function cleanupBase(ids: SeedIds): Promise<void> {
  try {
    await ECInventoryPrice.destroy({
      where: { inventoryId: ids.inventoryId },
      force: true,
    });
  } catch {}
  try {
    await ECInventory.destroy({ where: { id: ids.inventoryId }, force: true });
  } catch {}
  try {
    await ECProduct.destroy({ where: { id: ids.productId }, force: true });
  } catch {}
  try {
    await ECVendorAddress.destroy({
      where: { id: ids.vendorAddressId },
      force: true,
    });
  } catch {}
  try {
    await ECVendorUser.destroy({
      where: { vendorId: ids.vendorId },
      force: true,
    });
  } catch {}
  try {
    await ECAddress.destroy({ where: { id: ids.addressId }, force: true });
  } catch {}
  try {
    await ECVendor.destroy({ where: { id: ids.vendorId }, force: true });
  } catch {}
  try {
    await ECBrand.destroy({ where: { id: ids.brandId }, force: true });
  } catch {}
  try {
    await ECLogisticUser.destroy({
      where: { logisticId: ids.logisticId },
      force: true,
    });
  } catch {}
  try {
    await ECLogisticShipmentWay.destroy({
      where: { logisticId: ids.logisticId },
      force: true,
    });
  } catch {}
  try {
    await ECLogistic.destroy({ where: { id: ids.logisticId }, force: true });
  } catch {}
  try {
    await EAVEntityType.destroy({
      where: { id: ids.entityTypeId },
      force: true,
    });
  } catch {}
}
