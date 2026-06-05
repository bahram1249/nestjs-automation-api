import * as request from 'supertest';
import * as moment from 'moment';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import {
  STOCK_INVENTORY_QUEUE,
  STOCK_INVENTORY_REMOVE_QUEUE,
  STOCK_INVENTORY_UPDATE_QUEUE,
} from './constants';
import { StockModule } from './stock.module';
import { SessionGuard, SessionIgnoreUserGuard } from '../../session/guard';
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
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Stocks (e2e)', () => {
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

  const sessionId = 'test-session-' + Date.now();
  const sessionId2 = 'test-session-2-' + Date.now();

  let brandId: number;
  let vendorId: number;
  let addressId: number;
  let vendorAddressId: number;
  let entityTypeId: number;
  let productId: number;
  let inventoryId: number;
  let stockId: number;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [StockModule],
      overrideBullMq: true,
      bullMqQueueNames: [
        STOCK_INVENTORY_QUEUE,
        STOCK_INVENTORY_REMOVE_QUEUE,
        STOCK_INVENTORY_UPDATE_QUEUE,
      ],
      overrideRedis: true,
      guardOverrides: [
        { original: SessionGuard, mock: TestingSessionGuard },
        { original: SessionIgnoreUserGuard, mock: TestingSessionGuard },
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

    const testUser = await User.findOne({ where: { id: 1 } });
    if (!testUser) throw new Error('User id=1 not seeded');

    // ── lookup: entityType with entityModelId=1 ────────────────
    let entityType = await entityTypeModel.findOne({
      where: { entityModelId: 1 },
    });
    if (!entityType) {
      entityType = await entityTypeModel.create({
        name: 'Test Product Type',
        slug: 'test-product-type',
        entityModelId: 1,
      } as any);
    }
    entityTypeId = Number(entityType.id);

    // ── brand ──────────────────────────────────────────────────
    const brand = await brandModel.create({
      name: 'Stock Test Brand',
      slug: 'stock-test-brand-' + Date.now(),
    } as any);
    brandId = Number(brand.id);

    // ── vendor ─────────────────────────────────────────────────
    const vendor = await vendorModel.create({
      name: 'Stock Test Vendor',
      slug: 'stock-test-vendor-' + Date.now(),
      userId: 1,
    } as any);
    vendorId = Number(vendor.id);

    await vendorUserModel.create({
      userId: 1,
      vendorId: vendorId,
    } as any);

    // ── address ────────────────────────────────────────────────
    const address = await addressModel.create({
      name: 'Stock Test Address',
      latitude: '35.6892',
      longitude: '51.3890',
      provinceId: 1,
      cityId: 1,
    } as any);
    addressId = Number(address.id);

    // ── vendorAddress ──────────────────────────────────────────
    const vendorAddress = await vendorAddressModel.create({
      vendorId: vendorId,
      addressId: addressId,
      userId: 1,
    } as any);
    vendorAddressId = Number(vendorAddress.id);

    // ── product + inventory ────────────────────────────────────
    const product = await productModel.create({
      id: -Date.now(),
      title: 'Stock Test Product',
      slug: 'stock-test-product-' + Date.now(),
      sku: 'STK-' + Date.now(),
      entityTypeId: entityTypeId,
      brandId: brandId,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
    } as any);
    productId = Number(product.id);

    const inv = await inventoryModel.create({
      productId: productId,
      vendorId: vendorId,
      qty: 100,
      vendorAddressId: vendorAddressId,
      inventoryStatusId: 1,
      userId: 1,
    } as any);
    inventoryId = Number(inv.id);

    await inventoryPriceModel.create({
      inventoryId: inventoryId,
      variationPriceId: 1,
      price: 50000,
      userId: 1,
    } as any);

    // ── user sessions ──────────────────────────────────────────
    await ECUserSession.create({
      id: sessionId,
      expireAt: moment().add(1, 'day').toDate(),
      isDeleted: false,
    } as any);
    await ECUserSession.create({
      id: sessionId2,
      expireAt: moment().add(1, 'day').toDate(),
      isDeleted: false,
    } as any);

    // ── stock rows ─────────────────────────────────────────────
    const stock = await stockModel.create({
      sessionId: sessionId,
      productId: productId,
      inventoryId: inventoryId,
      qty: 3,
      expire: moment().add(1, 'day').toDate(),
      isDeleted: false,
      isPurchase: false,
    } as any);
    stockId = Number(stock.id);
  });

  afterAll(async () => {
    if (app) {
      try {
        await stockModel.destroy({
          where: { sessionId: [sessionId, sessionId2] },
          force: true,
        });
      } catch {}
      try {
        await inventoryPriceModel.destroy({
          where: { inventoryId: inventoryId },
          force: true,
        });
      } catch {}
      try {
        await inventoryModel.destroy({
          where: { id: inventoryId },
          force: true,
        });
      } catch {}
      try {
        await productModel.destroy({
          where: { id: productId },
          force: true,
        });
      } catch {}
      try {
        await vendorAddressModel.destroy({
          where: { id: vendorAddressId },
          force: true,
        });
      } catch {}
      try {
        await vendorUserModel.destroy({
          where: { vendorId: vendorId },
          force: true,
        });
      } catch {}
      try {
        await vendorModel.destroy({
          where: { id: vendorId },
          force: true,
        });
      } catch {}
      try {
        await addressModel.destroy({
          where: { id: addressId },
          force: true,
        });
      } catch {}
      try {
        await brandModel.destroy({
          where: { id: brandId },
          force: true,
        });
      } catch {}
      try {
        await entityTypeModel.destroy({
          where: { id: entityTypeId },
          force: true,
        });
      } catch {}

      await app.close();
    }
  });

  // ──────────────────────────────────────────────────────────────
  //  GET /
  // ──────────────────────────────────────────────────────────────
  describe('GET /v1/api/ecommerce/user/stocks', () => {
    it('should return stock list with product details', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/user/stocks')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result.length).toBe(1);

      const stock = res.body.result[0];
      expect(String(stock.id)).toBe(String(stockId));
      expect(String(stock.inventoryId)).toBe(String(inventoryId));
      expect(String(stock.productId)).toBe(String(productId));
      expect(stock).toHaveProperty('qty', 3);

      // nested product with matched inventory
      expect(stock).toHaveProperty('product');
      expect(String(stock.product.id)).toBe(String(productId));
      expect(stock.product).toHaveProperty('title', 'Stock Test Product');
      expect(stock.product).toHaveProperty('inventories');
      expect(Array.isArray(stock.product.inventories)).toBe(true);
      expect(stock.product.inventories.length).toBe(1);
      expect(String(stock.product.inventories[0].id)).toBe(String(inventoryId));
    });

    it('should return 403 without x-session-id header', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/user/stocks')
        .expect(403);
    });

    it('should return 403 with invalid session id', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/user/stocks')
        .set('x-session-id', 'non-existent-session')
        .expect(403);
    });
  });

  // ──────────────────────────────────────────────────────────────
  //  GET /count
  // ──────────────────────────────────────────────────────────────
  describe('GET /v1/api/ecommerce/user/stocks/count', () => {
    it('should return stock count', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/user/stocks/count')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(typeof res.body.result).toBe('number');
      expect(res.body.result).toBeGreaterThanOrEqual(1);
    });

    it('should return 403 without x-session-id', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/user/stocks/count')
        .expect(403);
    });
  });

  // ──────────────────────────────────────────────────────────────
  //  DELETE /:id
  // ──────────────────────────────────────────────────────────────
  describe('DELETE /v1/api/ecommerce/user/stocks/:id', () => {
    it('should soft-delete an existing stock', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/v1/api/ecommerce/user/stocks/${stockId}`)
        .set(authHeader())
        .set('x-session-id', sessionId)
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(String(res.body.result.id)).toBe(String(stockId));
    });

    it('should return 404 for non-existent stock id', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/user/stocks/999999999')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .expect(404);
    });
  });

  // ──────────────────────────────────────────────────────────────
  //  POST / (create)
  // ──────────────────────────────────────────────────────────────
  describe('POST /v1/api/ecommerce/user/stocks', () => {
    const createSessionId = 'create-stock-session-' + Date.now();

    beforeAll(async () => {
      await ECUserSession.create({
        id: createSessionId,
        expireAt: moment().add(1, 'day').toDate(),
        isDeleted: false,
      } as any);
    });

    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/user/stocks')
        .set(authHeader())
        .set('x-session-id', createSessionId)
        .send({})
        .expect(400);
    });

    it('should return 400 when inventoryId is invalid (non-existent inventory)', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/user/stocks')
        .set(authHeader())
        .set('x-session-id', createSessionId)
        .send({
          inventoryId: 999999999,
          qty: 1,
        })
        .expect(400);
    });
  });

  // ──────────────────────────────────────────────────────────────
  //  PUT / (update)
  // ──────────────────────────────────────────────────────────────
  describe('PUT /v1/api/ecommerce/user/stocks', () => {
    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .put('/v1/api/ecommerce/user/stocks')
        .set(authHeader())
        .set('x-session-id', sessionId)
        .send({})
        .expect(400);
    });
  });
});
