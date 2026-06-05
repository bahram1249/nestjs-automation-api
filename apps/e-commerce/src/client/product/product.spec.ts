import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { ProductModule } from './product.module';
import {
  ECProduct,
  ECInventory,
  ECInventoryPrice,
  ECBrand,
  ECVendor,
  ECAddress,
  ECVendorAddress,
  EAVEntityType,
  ECPublishStatus,
  ECInventoryStatus,
  ECVariationPrice,
  ECSlugVersion,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import {
  QUERY_NEXT_PAGE_PRODUCT_QUEUE,
  QUERY_NEXT_PAGE_PRODUCT_WITH_LAT_LON_QUEUE,
  PRODUCT_VIEW_QUEUE,
} from './constants';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Client-Products (e2e)', () => {
  let app: NestExpressApplication;

  let productModel: typeof ECProduct;
  let inventoryModel: typeof ECInventory;
  let inventoryPriceModel: typeof ECInventoryPrice;
  let brandModel: typeof ECBrand;
  let vendorModel: typeof ECVendor;
  let addressModel: typeof ECAddress;
  let vendorAddressModel: typeof ECVendorAddress;
  let entityTypeModel: typeof EAVEntityType;
  let slugVersionModel: typeof ECSlugVersion;

  let brandId: number;
  let brandId2: number;
  let vendorId: number;
  let addressId: number;
  let vendorAddressId: number;
  let entityTypeId: number;
  let productId1: number;
  let productId2: number;
  let productId3: number;
  let inventoryId1: number;
  let inventoryId2: number;
  let inventoryId3: number;
  let productSlugAlpha: string;
  let productSlugBeta: string;
  let productSlugGamma: string;
  let deletedProductId: number;
  let deletedProductSlug: string;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [ProductModule],
      overrideBullMq: true,
      bullMqQueueNames: [
        QUERY_NEXT_PAGE_PRODUCT_QUEUE,
        QUERY_NEXT_PAGE_PRODUCT_WITH_LAT_LON_QUEUE,
        PRODUCT_VIEW_QUEUE,
      ],
      overrideRedis: true,
    });

    productModel = ECProduct;
    inventoryModel = ECInventory;
    inventoryPriceModel = ECInventoryPrice;
    brandModel = ECBrand;
    vendorModel = ECVendor;
    addressModel = ECAddress;
    vendorAddressModel = ECVendorAddress;
    entityTypeModel = EAVEntityType;
    slugVersionModel = ECSlugVersion;

    const publishStatus = await ECPublishStatus.findOne({ where: { id: 1 } });
    if (!publishStatus) throw new Error('ECPublishStatus id=1 not seeded');

    const inventoryStatus = await ECInventoryStatus.findOne({
      where: { id: 1 },
    });
    if (!inventoryStatus) throw new Error('ECInventoryStatus id=1 not seeded');

    const variationPrice = await ECVariationPrice.findOne({
      where: { id: 1 },
    });
    if (!variationPrice) throw new Error('ECVariationPrice id=1 not seeded');

    const testUser = await User.findOne({ where: { id: 1 } });
    if (!testUser) throw new Error('User id=1 not seeded');

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

    const brand = await brandModel.create({
      name: 'Test Brand',
      slug: 'test-brand-' + Date.now(),
    } as any);
    brandId = Number(brand.id);

    const brand2 = await brandModel.create({
      name: 'Second Brand',
      slug: 'second-brand-' + Date.now(),
    } as any);
    brandId2 = Number(brand2.id);

    const vendor = await vendorModel.create({
      name: 'Test Vendor',
      slug: 'test-vendor-' + Date.now(),
      userId: 1,
    } as any);
    vendorId = Number(vendor.id);

    const address = await addressModel.create({
      name: 'Test Address',
      latitude: '35.6892',
      longitude: '51.3890',
      provinceId: 1,
      cityId: 1,
    } as any);
    addressId = Number(address.id);

    const vendorAddress = await vendorAddressModel.create({
      vendorId: vendorId,
      addressId: addressId,
      userId: 1,
    } as any);
    vendorAddressId = Number(vendorAddress.id);

    productSlugAlpha = 'test-product-alpha-' + Date.now();
    const prod1 = await productModel.create({
      id: -(Date.now() + 1),
      title: 'Test Product Alpha',
      slug: productSlugAlpha,
      sku: 'TST-A-' + Date.now(),
      entityTypeId: entityType.id,
      brandId: brand.id,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
    } as any);
    productId1 = Number(prod1.id);

    const inv1 = await inventoryModel.create({
      productId: productId1,
      vendorId: vendorId,
      qty: 10,
      vendorAddressId: vendorAddressId,
      inventoryStatusId: 1,
      userId: 1,
    } as any);
    inventoryId1 = Number(inv1.id);

    await inventoryPriceModel.create({
      inventoryId: inventoryId1,
      variationPriceId: 1,
      price: 100000,
      userId: 1,
    } as any);

    productSlugBeta = 'test-product-beta-' + Date.now();
    const prod2 = await productModel.create({
      id: -(Date.now() + 2),
      title: 'Test Product Beta',
      slug: productSlugBeta,
      sku: 'TST-B-' + Date.now(),
      entityTypeId: entityType.id,
      brandId: brand.id,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
    } as any);
    productId2 = Number(prod2.id);

    const inv2 = await inventoryModel.create({
      productId: productId2,
      vendorId: vendorId,
      qty: 20,
      vendorAddressId: vendorAddressId,
      inventoryStatusId: 1,
      userId: 1,
    } as any);
    inventoryId2 = Number(inv2.id);

    await inventoryPriceModel.create({
      inventoryId: inventoryId2,
      variationPriceId: 1,
      price: 200000,
      userId: 1,
    } as any);

    productSlugGamma = 'test-product-gamma-' + Date.now();
    const prod3 = await productModel.create({
      id: -(Date.now() + 3),
      title: 'Test Product Gamma',
      slug: productSlugGamma,
      sku: 'TST-G-' + Date.now(),
      entityTypeId: entityType.id,
      brandId: brand2.id,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
    } as any);
    productId3 = Number(prod3.id);

    const inv3 = await inventoryModel.create({
      productId: productId3,
      vendorId: vendorId,
      qty: 30,
      vendorAddressId: vendorAddressId,
      inventoryStatusId: 1,
      userId: 1,
    } as any);
    inventoryId3 = Number(inv3.id);

    await inventoryPriceModel.create({
      inventoryId: inventoryId3,
      variationPriceId: 1,
      price: 300000,
      userId: 1,
    } as any);

    deletedProductSlug = 'test-product-deleted-' + Date.now();
    const deletedProd = await productModel.create({
      id: -(Date.now() + 4),
      title: 'Test Product Deleted',
      slug: deletedProductSlug,
      sku: 'TST-D-' + Date.now(),
      entityTypeId: entityType.id,
      brandId: brand.id,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
      isDeleted: true,
    } as any);
    deletedProductId = Number(deletedProd.id);
  });

  afterAll(async () => {
    if (app) {
      try {
        await inventoryPriceModel.destroy({
          where: { inventoryId: [inventoryId1, inventoryId2, inventoryId3] },
          force: true,
        });
      } catch {}
      try {
        await inventoryModel.destroy({
          where: { productId: [productId1, productId2, productId3] },
          force: true,
        });
      } catch {}
      try {
        await slugVersionModel.destroy({
          where: { entityId: [productId1, productId2, productId3] },
          force: true,
        });
      } catch {}
      try {
        await productModel.destroy({
          where: { id: [productId1, productId2, productId3, deletedProductId] },
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
          where: { id: [brandId, brandId2] },
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

  describe('GET /v1/api/ecommerce/products', () => {
    it('should return paginated list with nested related models', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products?limit=100&vendorId=${vendorId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('total');
      expect(typeof res.body.total).toBe('number');
      expect(Array.isArray(res.body.result)).toBe(true);

      expect(res.body.total).toBeGreaterThanOrEqual(3);

      const seeded = res.body.result.find(
        (p) => p.slug === productSlugAlpha,
      );
      expect(seeded).toBeDefined();

      expect(seeded).toHaveProperty('id');
      expect(seeded).toHaveProperty('title', 'Test Product Alpha');
      expect(seeded).toHaveProperty('slug', productSlugAlpha);
      expect(seeded).toHaveProperty('entityTypeId');
      expect(seeded).toHaveProperty('brandId');
      expect(seeded).toHaveProperty('publishStatusId');
      expect(seeded).toHaveProperty('viewCount');

      expect(seeded).toHaveProperty('brand');
      expect(seeded.brand).toHaveProperty('name', 'Test Brand');

      expect(seeded).toHaveProperty('publishStatus');
      expect(seeded.publishStatus).toHaveProperty('id', 1);
      expect(seeded.publishStatus).toHaveProperty('name');

      expect(seeded).toHaveProperty('inventoryStatus');
      expect(seeded.inventoryStatus).toHaveProperty('id');
      expect(seeded.inventoryStatus).toHaveProperty('name');

      expect(seeded).toHaveProperty('entityType');
      expect(seeded.entityType).toHaveProperty('id', entityTypeId);
      expect(seeded.entityType).toHaveProperty('name');
    });

    it('should return inventories with nested vendor and pricing', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products?limit=100&vendorId=${vendorId}`)
        .set(authHeader())
        .expect(200);

      const seeded = res.body.result.find(
        (p) => p.slug === productSlugAlpha,
      );
      expect(seeded).toBeDefined();
      expect(seeded).toHaveProperty('inventories');
      expect(Array.isArray(seeded.inventories)).toBe(true);
      expect(seeded.inventories.length).toBeGreaterThanOrEqual(1);

      const inv = seeded.inventories[0];
      expect(Number(inv.id)).toBe(inventoryId1);
      expect(Number(inv.productId)).toBe(productId1);
      expect(Number(inv.vendorId)).toBe(vendorId);
      expect(inv.qty).toBe(10);

      expect(inv).toHaveProperty('vendor');
      expect(Number(inv.vendor.id)).toBe(vendorId);
      expect(inv.vendor).toHaveProperty('name', 'Test Vendor');

      expect(inv).toHaveProperty('inventoryStatus');
      expect(inv.inventoryStatus).toHaveProperty('id', 1);
      expect(inv.inventoryStatus).toHaveProperty('name');

      expect(inv).toHaveProperty('firstPrice');
      expect(inv.firstPrice).not.toBeNull();
      expect(Number(inv.firstPrice.price)).toBe(100000);
    });

    it('should respect limit and offset pagination', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products?limit=1&offset=0')
        .set(authHeader())
        .expect(200);

      const page2 = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products?limit=1&offset=1')
        .set(authHeader())
        .expect(200);

      expect(page1.body.result.length).toBe(1);
      expect(page2.body.result.length).toBe(1);
      expect(Number(page1.body.result[0].id)).not.toBe(
        Number(page2.body.result[0].id),
      );
    });

    it('should search products by title', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products?limit=10&search=Alpha')
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(1);
      for (const product of res.body.result) {
        expect(product.title).toContain('Alpha');
      }
    });

    it('should filter by brands', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products?limit=10&brands=${brandId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(2);
      for (const product of res.body.result) {
        expect(Number(product.brandId)).toBe(brandId);
      }
    });

    it('should filter by brands (multiple)', async () => {
      const res = await request(app.getHttpServer())
        .get(
          `/v1/api/ecommerce/products?limit=10&brands=${brandId}&brands=${brandId2}`,
        )
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(3);
    });

    it('should sort by id descending', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/v1/api/ecommerce/products?limit=10&orderBy=id&sortOrder=DESC',
        )
        .set(authHeader())
        .expect(200);

      expect(res.body.result.length).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < res.body.result.length; i++) {
        expect(Number(res.body.result[i].id)).toBeLessThan(
          Number(res.body.result[i - 1].id),
        );
      }
    });

    it('should filter by vendorId', async () => {
      const res = await request(app.getHttpServer())
        .get(
          `/v1/api/ecommerce/products?limit=10&vendorId=${vendorId}`,
        )
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(3);
    });

    it('should return empty result when no products match filter', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products?limit=10&brands=99999')
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body.total).toBe(0);
      expect(res.body.result).toEqual([]);
    });
  });

  describe('GET /v1/api/ecommerce/products/id/:id', () => {
    it('should return single product with full details', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products/id/${productId1}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.result.id)).toBe(productId1);
      expect(res.body.result.result.title).toBe('Test Product Alpha');
      expect(res.body.result.result.slug).toBe(productSlugAlpha);

      const product = res.body.result.result;
      expect(product).toHaveProperty('brand');
      expect(product.brand.name).toBe('Test Brand');
      expect(product).toHaveProperty('publishStatus');
      expect(product).toHaveProperty('inventoryStatus');
      expect(product).toHaveProperty('entityType');
      expect(product).toHaveProperty('inventories');

      expect(product).toHaveProperty('productAttributeValues');
      expect(Array.isArray(product.productAttributeValues)).toBe(true);
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products/id/999999999')
        .set(authHeader())
        .expect(404);
    });
  });

  describe('GET /v1/api/ecommerce/products/:slug', () => {
    it('should return single product by slug', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products/${productSlugAlpha}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body.result.result.slug).toBe(productSlugAlpha);
      expect(res.body.result.result.title).toBe('Test Product Alpha');
      expect(Number(res.body.result.result.id)).toBe(productId1);

      const product = res.body.result.result;
      expect(product).toHaveProperty('brand');
      expect(product.brand.name).toBe('Test Brand');
      expect(product).toHaveProperty('inventories');
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products/non-existent-slug-xyz')
        .set(authHeader())
        .expect(404);
    });

    it('should return 410 Gone for deleted product slug', async () => {
      await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products/${deletedProductSlug}`)
        .set(authHeader())
        .expect(410);
    });

    it('should redirect when slug has been changed', async () => {
      const newSlug = 'redirected-slug-' + Date.now();

      await slugVersionModel.create({
        slug: newSlug,
        slugVersionTypeId: 1,
        entityId: productId1,
      } as any);

      await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products/${newSlug}`)
        .set(authHeader())
        .expect(302);
    });
  });

  describe('GET /v1/api/ecommerce/products/priceRange', () => {
    it('should return min and max prices', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products/priceRange')
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body.result).toHaveProperty('minPrice');
      expect(res.body.result).toHaveProperty('maxPrice');
      expect(Number(res.body.result.minPrice)).toBe(100000);
      expect(Number(res.body.result.maxPrice)).toBe(300000);
    });

    it('should respect brand filter for price range', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/products/priceRange?brands=${brandId2}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.minPrice)).toBe(300000);
      expect(Number(res.body.result.maxPrice)).toBe(300000);
    });

    it('should return defaults for empty result set', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/products/priceRange?brands=99999')
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(res.body.result).toHaveProperty('minPrice');
      expect(res.body.result).toHaveProperty('maxPrice');
    });
  });
});
