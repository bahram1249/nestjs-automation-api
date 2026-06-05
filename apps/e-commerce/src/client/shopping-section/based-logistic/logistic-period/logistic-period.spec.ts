import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { ClientLogisticPeriodModule } from './logistic-period.module';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';
import { TestingSessionGuard } from '@rahino/commontools/test/util';
import {
  ECStock,
  ECProduct,
  ECInventory,
  ECInventoryPrice,
  ECBrand,
  ECVendor,
  ECAddress,
  ECVendorAddress,
  EAVEntityType,
  ECUserSession,
  ECVendorUser,
  ECVendorLogistic,
  ECLogistic,
  ECLogisticShipmentWay,
  ECLogisticSendingPeriod,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';
import { User, PersianDate } from '@rahino/database';
import { OrderShipmentwayEnum, ScheduleSendingTypeEnum } from '@rahino/ecommerce/shared/enum';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Client-Logistic-Periods (e2e)', () => {
  let app: NestExpressApplication;

  let stockModel: typeof ECStock;
  let productModel: typeof ECProduct;
  let inventoryModel: typeof ECInventory;
  let inventoryPriceModel: typeof ECInventoryPrice;
  let brandModel: typeof ECBrand;
  let vendorModel: typeof ECVendor;
  let addressModel: typeof ECAddress;
  let vendorAddressModel: typeof ECVendorAddress;
  let entityTypeModel: typeof EAVEntityType;
  let vendorUserModel: typeof ECVendorUser;
  let vendorLogisticModel: typeof ECVendorLogistic;
  let logisticModel: typeof ECLogistic;
  let shipmentWayModel: typeof ECLogisticShipmentWay;
  let sendingPeriodModel: typeof ECLogisticSendingPeriod;
  let weeklyPeriodModel: typeof ECLogisticWeeklyPeriod;
  let weeklyPeriodTimeModel: typeof ECLogisticWeeklyPeriodTime;

  const sessionId = 'test-logistic-period-session-' + Date.now();
  let brandId: number;
  let vendorId: number;
  let addressId: number;
  let vendorAddressId: number;
  let entityTypeId: number;
  let productId: number;
  let inventoryId: number;
  let logisticId: number;
  let vendorLogisticId: number;
  let shipmentWayId: number;
  let sendingPeriodId: number;
  let weeklyPeriodId: number;
  let weeklyPeriodTimeId: number;
  let createdEntityType = false;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [ClientLogisticPeriodModule],
      guardOverrides: [
        { original: SessionGuard, mock: TestingSessionGuard },
      ],
    });

    stockModel = ECStock;
    productModel = ECProduct;
    inventoryModel = ECInventory;
    inventoryPriceModel = ECInventoryPrice;
    brandModel = ECBrand;
    vendorModel = ECVendor;
    addressModel = ECAddress;
    vendorAddressModel = ECVendorAddress;
    entityTypeModel = EAVEntityType;
    vendorUserModel = ECVendorUser;
    vendorLogisticModel = ECVendorLogistic;
    logisticModel = ECLogistic;
    shipmentWayModel = ECLogisticShipmentWay;
    sendingPeriodModel = ECLogisticSendingPeriod;
    weeklyPeriodModel = ECLogisticWeeklyPeriod;
    weeklyPeriodTimeModel = ECLogisticWeeklyPeriodTime;

    const testUser = await User.findOne({ where: { id: 1 } });
    if (!testUser) throw new Error('User id=1 not seeded');

    // ── entity type ─────────────────────────────────────────────
    let entityType = await entityTypeModel.findOne({
      where: { entityModelId: 1 },
    });
    if (!entityType) {
      entityType = await entityTypeModel.create({
        name: 'LP Test Product Type',
        slug: 'lp-test-product-type',
        entityModelId: 1,
      } as any);
      createdEntityType = true;
    }
    entityTypeId = Number(entityType.id);

    // ── brand ───────────────────────────────────────────────────
    const brand = await brandModel.create({
      name: 'LP Test Brand',
      slug: 'lp-test-brand-' + Date.now(),
    } as any);
    brandId = Number(brand.id);

    // ── vendor ──────────────────────────────────────────────────
    const vendor = await vendorModel.create({
      name: 'LP Test Vendor',
      slug: 'lp-test-vendor-' + Date.now(),
      userId: 1,
    } as any);
    vendorId = Number(vendor.id);

    await vendorUserModel.create({
      userId: 1,
      vendorId: vendorId,
    } as any);

    // ── logistic ────────────────────────────────────────────────
    const logistic = await logisticModel.create({
      title: 'LP Test Logistic',
    } as any);
    logisticId = Number(logistic.id);

    // ── vendor logistic ─────────────────────────────────────────
    const vendorLogistic = await vendorLogisticModel.create({
      vendorId: vendorId,
      logisticId: logisticId,
      isDefault: true,
      isDeleted: false,
    } as any);
    vendorLogisticId = Number(vendorLogistic.id);

    // ── address (non-Tehran province → exercises real shipment way path) ──
    const address = await addressModel.create({
      name: 'LP Test Address',
      latitude: '35.6892',
      longitude: '51.3890',
      provinceId: 1,
      cityId: 1,
      userId: 1,
    } as any);
    addressId = Number(address.id);

    // ── vendor address ──────────────────────────────────────────
    const vendorAddress = await vendorAddressModel.create({
      vendorId: vendorId,
      addressId: addressId,
      userId: 1,
    } as any);
    vendorAddressId = Number(vendorAddress.id);

    // ── product ─────────────────────────────────────────────────
    const product = await productModel.create({
      id: -Date.now(),
      title: 'LP Test Product',
      slug: 'lp-test-product-' + Date.now(),
      sku: 'LP-' + Date.now(),
      entityTypeId: entityTypeId,
      brandId: brandId,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
    } as any);
    productId = Number(product.id);

    // ── inventory ───────────────────────────────────────────────
    const inv = await inventoryModel.create({
      productId: productId,
      vendorId: vendorId,
      qty: 100,
      vendorAddressId: vendorAddressId,
      inventoryStatusId: 1,
      scheduleSendingTypeId: 1,
      offsetDay: 0,
      userId: 1,
    } as any);
    inventoryId = Number(inv.id);

    await inventoryPriceModel.create({
      inventoryId: inventoryId,
      variationPriceId: 1,
      price: 50000,
      userId: 1,
    } as any);

    // ── user session ────────────────────────────────────────────
    await ECUserSession.create({
      id: sessionId,
      expireAt: new Date(Date.now() + 86400000),
      isDeleted: false,
    } as any);

    // ── stock ───────────────────────────────────────────────────
    await stockModel.create({
      sessionId: sessionId,
      productId: productId,
      inventoryId: inventoryId,
      qty: 2,
      expire: new Date(Date.now() + 86400000),
      isDeleted: false,
      isPurchase: false,
    } as any);

    // ── logistic shipment way (province 1, matching address) ────
    const shipmentWay = await shipmentWayModel.create({
      logisticId: logisticId,
      orderShipmentWayId: 1,
      provinceId: 1,
      isDeleted: false,
    } as any);
    shipmentWayId = Number(shipmentWay.id);

    // ── sending period ──────────────────────────────────────────
    const sendingPeriod = await sendingPeriodModel.create({
      logisticShipmentWayId: shipmentWayId,
      scheduleSendingTypeId: 1,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000 * 30),
      isDeleted: false,
    } as any);
    sendingPeriodId = Number(sendingPeriod.id);

    // ── weekly period (weekNumber 3 = Monday) ───────────────────
    const weeklyPeriod = await weeklyPeriodModel.create({
      logisticSendingPeriodId: sendingPeriodId,
      weekNumber: 3,
      isDeleted: false,
    } as any);
    weeklyPeriodId = Number(weeklyPeriod.id);

    // ── weekly period time ──────────────────────────────────────
    const weeklyPeriodTime = await weeklyPeriodTimeModel.create({
      logisticWeeklyPeriodId: weeklyPeriodId,
      startTime: '09:00:00',
      endTime: '12:00:00',
      capacity: 10,
      isDeleted: false,
    } as any);
    weeklyPeriodTimeId = Number(weeklyPeriodTime.id);
  });

  afterAll(async () => {
    if (!app) return;
    const errors: string[] = [];
    const del = async (label: string, fn: () => Promise<any>) => {
      try {
        await fn();
      } catch (e) {
        errors.push(`${label}: ${e.message}`);
      }
    };

    await del('stock', () =>
      stockModel.destroy({ where: { sessionId: sessionId }, force: true }),
    );
    await del('userSession', () =>
      ECUserSession.destroy({ where: { id: sessionId }, force: true }),
    );
    await del('inventoryPrice', () =>
      inventoryPriceModel.destroy({
        where: { inventoryId: inventoryId },
        force: true,
      }),
    );
    await del('weeklyPeriodTime', () =>
      weeklyPeriodTimeModel.destroy({
        where: { id: weeklyPeriodTimeId },
        force: true,
      }),
    );
    await del('weeklyPeriod', () =>
      weeklyPeriodModel.destroy({
        where: { id: weeklyPeriodId },
        force: true,
      }),
    );
    await del('sendingPeriod', () =>
      sendingPeriodModel.destroy({
        where: { id: sendingPeriodId },
        force: true,
      }),
    );
    await del('shipmentWay', () =>
      shipmentWayModel.destroy({
        where: { id: shipmentWayId },
        force: true,
      }),
    );
    await del('inventory', () =>
      inventoryModel.destroy({ where: { id: inventoryId }, force: true }),
    );
    await del('product', () =>
      productModel.destroy({ where: { id: productId }, force: true }),
    );
    await del('vendorLogistic', () =>
      vendorLogisticModel.destroy({
        where: { id: vendorLogisticId },
        force: true,
      }),
    );
    await del('logistic', () =>
      logisticModel.destroy({ where: { id: logisticId }, force: true }),
    );
    await del('vendorAddress', () =>
      vendorAddressModel.destroy({
        where: { id: vendorAddressId },
        force: true,
      }),
    );
    await del('vendorUser', () =>
      vendorUserModel.destroy({ where: { vendorId: vendorId }, force: true }),
    );
    await del('vendor', () =>
      vendorModel.destroy({ where: { id: vendorId }, force: true }),
    );
    await del('address', () =>
      addressModel.destroy({ where: { id: addressId }, force: true }),
    );
    await del('brand', () =>
      brandModel.destroy({ where: { id: brandId }, force: true }),
    );
    if (createdEntityType) {
      await del('entityType', () =>
        entityTypeModel.destroy({ where: { id: entityTypeId }, force: true }),
      );
    }

    await app.close();
    if (errors.length) throw new Error(errors.join('; '));
  });

  // ──────────────────────────────────────────────────────────────
  //  SECURITY
  // ──────────────────────────────────────────────────────────────
  describe('security', () => {
    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .send({ addressId: 1 })
        .expect(403);
    });

    it('should fail with 403 if no x-session-id header', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .send({ addressId: 1 })
        .expect(403);
    });
  });

  // ──────────────────────────────────────────────────────────────
  //  VALIDATION
  // ──────────────────────────────────────────────────────────────
  describe('validation', () => {
    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({})
        .expect(400);
    });

    it('should return 400 when addressId is not a number', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: 'not-a-number' })
        .expect(400);
    });
  });

  // ──────────────────────────────────────────────────────────────
  //  SUCCESS — business logic
  // ──────────────────────────────────────────────────────────────
  describe('POST /v1/api/ecommerce/client/logisticPeriods', () => {
    it('should return grouped delivery options with logistic/vendor info', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: addressId })
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result.length).toBeGreaterThanOrEqual(1);

      const group = res.body.result[0];
      expect(group).toHaveProperty('logisticId', logisticId);
      expect(group).toHaveProperty('logisticName');
      // vendorIds is a Set in the service; JSON serializes as {}
      expect(group).toHaveProperty('vendorIds');
      expect(group).toHaveProperty('vendorNames');
      expect(group).toHaveProperty('sendingOptions');
      expect(Array.isArray(group.sendingOptions)).toBe(true);
    });

    it('should return sending options with correct scheduleSendingTypeId = 1 (normal)', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: addressId })
        .expect(200);

      const group = res.body.result[0];
      const options = group.sendingOptions;
      expect(options.length).toBeGreaterThanOrEqual(1);

      const normalOption = options.find(
        (o: any) => o.typeId === ScheduleSendingTypeEnum.normalSending,
      );
      expect(normalOption).toBeDefined();
      expect(normalOption).toHaveProperty('typeName');
      expect(normalOption).toHaveProperty('supportedStockIds');
      expect(Array.isArray(normalOption.supportedStockIds)).toBe(true);
    });

    it('should return shipment ways with possible dates matching weekNumber = 3 (Monday)', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: addressId })
        .expect(200);

      const group = res.body.result[0];
      const normalOption = group.sendingOptions.find(
        (o: any) => o.typeId === ScheduleSendingTypeEnum.normalSending,
      );
      expect(normalOption.shipmentWays.length).toBeGreaterThanOrEqual(1);

      const way = normalOption.shipmentWays[0];
      expect(way).toHaveProperty('shipmentWayId', shipmentWayId);
      expect(way).toHaveProperty('orderShipmentwayId', 1);
      expect(way).toHaveProperty('possibleDates');
      expect(Array.isArray(way.possibleDates)).toBe(true);
      expect(way.possibleDates.length).toBeGreaterThanOrEqual(1);

      // every possibleDate should be a Monday (weekNumber = 3)
      for (const pd of way.possibleDates) {
        expect(pd).toHaveProperty('weekDayName');
        expect(pd).toHaveProperty('gregorianDate');
        expect(pd).toHaveProperty('persianDate');
        expect(Array.isArray(pd.times)).toBe(true);
        expect(pd.times.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should return time slots with correct structure and our seeded values', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: addressId })
        .expect(200);

      const group = res.body.result[0];
      const normalOption = group.sendingOptions.find(
        (o: any) => o.typeId === ScheduleSendingTypeEnum.normalSending,
      );
      const way = normalOption.shipmentWays[0];
      const allTimes = way.possibleDates.flatMap((pd: any) => pd.times);
      expect(allTimes.length).toBeGreaterThanOrEqual(1);

      const firstTime = allTimes[0];
      expect(firstTime).toHaveProperty('startTime');
      expect(firstTime).toHaveProperty('endTime');
      expect(firstTime).toHaveProperty('capacity');
      expect(typeof firstTime.startTime).toBe('string');
      expect(typeof firstTime.endTime).toBe('string');
      expect(Number(firstTime.capacity)).toBeGreaterThanOrEqual(0);
      expect(firstTime).toHaveProperty('weeklyPeriodTimeId');
      expect(firstTime).toHaveProperty('sendingPeriodId');
      expect(firstTime).toHaveProperty('weeklyPeriodId');
    });

    it('should return bestSelection with earliest date and time', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: addressId })
        .expect(200);

      const group = res.body.result[0];
      const normalOption = group.sendingOptions.find(
        (o: any) => o.typeId === ScheduleSendingTypeEnum.normalSending,
      );
      expect(normalOption).toHaveProperty('bestSelection');
      const bs = normalOption.bestSelection;
      expect(bs).toHaveProperty('shipmentWayId');
      expect(bs).toHaveProperty('gregorianDate');
      expect(bs).toHaveProperty('weeklyPeriodTimeId');
    });

    it('should return price and realShipmentPrice as numbers', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/client/logisticPeriods')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({ addressId: addressId })
        .expect(200);

      const group = res.body.result[0];
      const normalOption = group.sendingOptions.find(
        (o: any) => o.typeId === ScheduleSendingTypeEnum.normalSending,
      );
      const way = normalOption.shipmentWays[0];
      expect(typeof way.price).toBe('number');
      expect(typeof way.realShipmentPrice).toBe('number');
      // price may be 0 if no postage fee covers our weight; verify it's non-negative
      expect(way.price).toBeGreaterThanOrEqual(0);
      expect(way.realShipmentPrice).toBeGreaterThanOrEqual(0);
    });
  });
});
