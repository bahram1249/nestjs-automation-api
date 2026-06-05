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
  ECVendorUser,
  ECSlugVersion,
  ECInventoryHistory,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { getModelToken } from '@nestjs/sequelize';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Admin-Product (e2e)', () => {
  let app: NestExpressApplication;

  let productModel: typeof ECProduct;
  let inventoryModel: typeof ECInventory;
  let inventoryPriceModel: typeof ECInventoryPrice;
  let brandModel: typeof ECBrand;
  let vendorModel: typeof ECVendor;
  let addressModel: typeof ECAddress;
  let vendorAddressModel: typeof ECVendorAddress;
  let entityTypeModel: typeof EAVEntityType;
  let vendorUserModel: typeof ECVendorUser;
  let slugVersionModel: typeof ECSlugVersion;

  // seeded record IDs for cleanup (number for JSON-safe comparisons)
  let brandId: number;
  let vendorId: number;
  let addressId: number;
  let vendorAddressId: number;
  let entityTypeId: number;
  let createdEntityType = false;
  let productId1: number;
  let productId2: number;
  let inventoryId: number;
  let inventoryId2: number;
  let postCreatedProductId: number;
  let productSlugAlpha: string;
  let productSlugBeta: string;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [ProductModule],
    });

    productModel = app.get<typeof ECProduct>(getModelToken(ECProduct));
    inventoryModel = app.get<typeof ECInventory>(getModelToken(ECInventory));
    inventoryPriceModel = app.get<typeof ECInventoryPrice>(
      getModelToken(ECInventoryPrice),
    );
    brandModel = app.get<typeof ECBrand>(getModelToken(ECBrand));
    vendorModel = app.get<typeof ECVendor>(getModelToken(ECVendor));
    addressModel = app.get<typeof ECAddress>(getModelToken(ECAddress));
    vendorAddressModel = app.get<typeof ECVendorAddress>(
      getModelToken(ECVendorAddress),
    );
    entityTypeModel = app.get<typeof EAVEntityType>(
      getModelToken(EAVEntityType),
    );
    vendorUserModel = app.get<typeof ECVendorUser>(getModelToken(ECVendorUser));
    slugVersionModel = app.get<typeof ECSlugVersion>(
      getModelToken(ECSlugVersion),
    );

    // ── lookup tables (already seeded by migrations) ──────────
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

    // ── find or create e-commerce entity type ─────────────────
    let entityType = await entityTypeModel.findOne({
      where: { entityModelId: 1 },
    });
    if (!entityType) {
      entityType = await entityTypeModel.create({
        name: 'Test Product Type',
        slug: 'test-product-type',
        entityModelId: 1,
      } as any);
      createdEntityType = true;
    }
    entityTypeId = Number(entityType.id);

    // ── seed test brand ────────────────────────────────────────
    const brand = await brandModel.create({
      name: 'Test Brand',
      slug: 'test-brand-' + Date.now(),
    } as any);
    brandId = Number(brand.id);

    // ── seed test vendor ───────────────────────────────────────
    const vendor = await vendorModel.create({
      name: 'Test Vendor',
      slug: 'test-vendor-' + Date.now(),
      userId: 1,
    } as any);
    vendorId = Number(vendor.id);

    // link user to vendor
    await vendorUserModel.create({
      userId: 1,
      vendorId: Number(vendor.id),
    } as any);

    // ── seed test address ──────────────────────────────────────
    const address = await addressModel.create({
      name: 'Test Address',
      latitude: '35.6892',
      longitude: '51.3890',
      provinceId: 1,
      cityId: 1,
    } as any);
    addressId = Number(address.id);

    // ── seed vendor address ────────────────────────────────────
    const vendorAddress = await vendorAddressModel.create({
      vendorId: Number(vendor.id),
      addressId: Number(address.id),
      userId: 1,
    } as any);
    vendorAddressId = Number(vendorAddress.id);

    // ── seed product 1 ─────────────────────────────────────────
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
      productId: Number(prod1.id),
      vendorId: Number(vendor.id),
      qty: 10,
      vendorAddressId: Number(vendorAddress.id),
      inventoryStatusId: 1,
      userId: 1,
    } as any);
    inventoryId = Number(inv1.id);

    await inventoryPriceModel.create({
      inventoryId: Number(inv1.id),
      variationPriceId: 1,
      price: 100000,
      userId: 1,
    } as any);

    // ── seed product 2 (for pagination) ───────────────────────
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
      productId: Number(prod2.id),
      vendorId: Number(vendor.id),
      qty: 20,
      vendorAddressId: Number(vendorAddress.id),
      inventoryStatusId: 1,
      userId: 1,
    } as any);
    inventoryId2 = Number(inv2.id);

    await inventoryPriceModel.create({
      inventoryId: Number(inv2.id),
      variationPriceId: 1,
      price: 200000,
      userId: 1,
    } as any);
  });

  afterAll(async () => {
    if (!app) return;
    const productIds = [productId1, productId2];
    if (postCreatedProductId) productIds.push(postCreatedProductId);
    const errors: string[] = [];
    const del = async (label: string, fn: () => Promise<any>) => {
      try {
        await fn();
      } catch (e) {
        errors.push(`${label}: ${e.message}`);
      }
    };

    // resolve all inventory IDs for tracked products
    const allInventories = await inventoryModel.findAll({
      where: { productId: productIds },
    });
    const allInventoryIds = allInventories.map((i) => Number(i.id));

    await del('inventoryPrice', () =>
      inventoryPriceModel.destroy({
        where: { inventoryId: allInventoryIds },
        force: true,
      }),
    );
    await del('inventoryHistory', () =>
      ECInventoryHistory.destroy({
        where: { inventoryId: allInventoryIds },
        force: true,
      }),
    );
    await del('inventory', () =>
      inventoryModel.destroy({
        where: { productId: productIds },
        force: true,
      }),
    );
    await del('slugVersion', () =>
      slugVersionModel.destroy({
        where: { entityId: productIds },
        force: true,
      }),
    );
    await del('product', () =>
      productModel.destroy({
        where: { id: productIds },
        force: true,
      }),
    );
    await del('vendorAddress', () =>
      vendorAddressModel.destroy({
        where: { id: vendorAddressId },
        force: true,
      }),
    );
    await del('vendorUser', () =>
      vendorUserModel.destroy({
        where: { vendorId: vendorId },
        force: true,
      }),
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

  // ────────────────────────────────────────────────────────────────
  //  GET LIST
  // ────────────────────────────────────────────────────────────────
  describe('GET /v1/api/ecommerce/admin/products', () => {
    it('should return paginated list with nested related models', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/products?limit=100&brandId=${brandId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('total');
      expect(typeof res.body.total).toBe('number');
      expect(Array.isArray(res.body.result)).toBe(true);



      // at least our 2 seeded products
      expect(res.body.total).toBeGreaterThanOrEqual(2);

      const product = res.body.result.find(
        (p) => p.slug === productSlugAlpha || p.slug === productSlugBeta,
      );
      expect(product).toBeDefined();

      // core fields
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('slug');
      expect(product).toHaveProperty('sku');
      expect(product).toHaveProperty('entityTypeId');
      expect(product).toHaveProperty('brandId');
      expect(product).toHaveProperty('publishStatusId');
      expect(product).toHaveProperty('viewCount');

      // nested brand
      expect(product).toHaveProperty('brand');
      expect(product.brand).toHaveProperty('id');
      expect(product.brand).toHaveProperty('name');
      expect(product.brand.name).toBe('Test Brand');

      // nested publishStatus
      expect(product).toHaveProperty('publishStatus');
      expect(product.publishStatus).toHaveProperty('id');
      expect(product.publishStatus).toHaveProperty('name');

      // nested inventoryStatus
      expect(product).toHaveProperty('inventoryStatus');
      expect(product.inventoryStatus).toHaveProperty('id');
      expect(product.inventoryStatus).toHaveProperty('name');

      // nested entityType
      expect(product).toHaveProperty('entityType');
      expect(product.entityType).toHaveProperty('id');
      expect(product.entityType).toHaveProperty('name');

      // FK consistency
      expect(Number(product.brand.id)).toBe(product.brandId);
      expect(Number(product.entityType.id)).toBe(product.entityTypeId);
    });

    it('should respect limit and offset pagination', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/products?limit=1&offset=0')
        .set(authHeader())
        .expect(200);

      const page2 = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/products?limit=1&offset=1')
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
        .get('/v1/api/ecommerce/admin/products?limit=10&search=Alpha')
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(1);
      for (const product of res.body.result) {
        expect(product.title).toContain('Alpha');
      }
    });

    it('should filter by brandId', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/products?limit=10&brandId=${brandId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(2);
      for (const product of res.body.result) {
        expect(product.brandId).toBe(brandId);
      }
    });

    it('should sort by id descending', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/v1/api/ecommerce/admin/products?limit=10&orderBy=id&sortOrder=DESC',
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

    it('should include attributes when includeAttribute=true', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/products?limit=100&includeAttribute=true&brandId=${brandId}`)
        .set(authHeader())
        .expect(200);

      const seeded = res.body.result.find((p) => p.slug === productSlugAlpha);
      expect(seeded).toBeDefined();
      expect(seeded).toHaveProperty('productAttributeValues');
      expect(Array.isArray(seeded.productAttributeValues)).toBe(true);
    });

    it('should return inventories with nested vendor and pricing', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/products?limit=100&brandId=${brandId}`)
        .set(authHeader())
        .expect(200);

      const seeded = res.body.result.find((p) => p.slug === productSlugAlpha);
      expect(seeded).toBeDefined();
      expect(seeded).toHaveProperty('inventories');
      expect(Array.isArray(seeded.inventories)).toBe(true);
      expect(seeded.inventories.length).toBe(1);

      const inv = seeded.inventories[0];
      expect(Number(inv.id)).toBe(inventoryId);
      expect(Number(inv.productId)).toBe(productId1);
      expect(inv.vendorId).toBe(vendorId);
      expect(inv.qty).toBe(10);
      expect(inv.inventoryStatusId).toBe(1);
      expect(Number(inv.vendorAddressId)).toBe(vendorAddressId);

      // nested vendor
      expect(inv).toHaveProperty('vendor');
      expect(inv.vendor.id).toBe(vendorId);
      expect(inv.vendor).toHaveProperty('name', 'Test Vendor');

      // nested inventoryStatus
      expect(inv).toHaveProperty('inventoryStatus');
      expect(inv.inventoryStatus.id).toBe(1);
      expect(inv.inventoryStatus).toHaveProperty('name');

      // nested vendorAddress -> address
      expect(inv).toHaveProperty('vendorAddress');
      expect(Number(inv.vendorAddress.id)).toBe(vendorAddressId);
      expect(inv.vendorAddress.vendorId).toBe(vendorId);
      expect(inv.vendorAddress).toHaveProperty('address');
      expect(inv.vendorAddress.address).toHaveProperty('name', 'Test Address');

      // firstPrice
      expect(inv).toHaveProperty('firstPrice');
      expect(inv.firstPrice).not.toBeNull();
      expect(inv.firstPrice).toHaveProperty('price');
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  GET BY ID
  // ────────────────────────────────────────────────────────────────
  describe('GET /v1/api/ecommerce/admin/products/:id', () => {
    it('should return single product with full details', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/products/${productId1}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(productId1);
      expect(res.body.result.title).toBe('Test Product Alpha');

      // nested models
      expect(res.body.result).toHaveProperty('brand');
      expect(res.body.result.brand.name).toBe('Test Brand');
      expect(res.body.result).toHaveProperty('publishStatus');
      expect(res.body.result).toHaveProperty('inventoryStatus');
      expect(res.body.result).toHaveProperty('entityType');
      expect(res.body.result).toHaveProperty('inventories');

      // productAttributeValues always included in findById
      expect(res.body.result).toHaveProperty('productAttributeValues');
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/products/999999999')
        .set(authHeader())
        .expect(404);
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  CREATE
  // ────────────────────────────────────────────────────────────────
  describe('POST /v1/api/ecommerce/admin/products', () => {
    const uniqueSlug = 'create-test-slug-' + Date.now();

    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/products')
        .set(authHeader())
        .send({})
        .expect(400);
    });

    it('should return 400 when slug already exists', async () => {
      const existingProduct = await productModel.findOne({ limit: 1 } as any);
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/products')
        .set(authHeader())
        .send({
          title: 'Duplicate Slug Post',
          slug: existingProduct.slug,
          entityTypeId: entityTypeId,
          brandId: brandId,
          attributes: [],
          photos: [],
          videos: [],
          inventories: [],
        })
        .expect(400);

      expect(res.body).toHaveProperty('statusCode', 400);
    });

    it('should return 400 when entityType is not e-commerce model', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/products')
        .set(authHeader())
        .send({
          title: 'Bad EntityType',
          slug: 'bad-entity-type-' + Date.now(),
          entityTypeId: 99999,
          brandId: brandId,
          attributes: [],
          photos: [],
          videos: [],
          inventories: [],
        })
        .expect(400);
    });

    it('should create a product with valid minimal data', async () => {
      const uniqueTitle = 'Created Product ' + Date.now();
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/products')
        .set(authHeader())
        .send({
          title: uniqueTitle,
          slug: uniqueSlug,
          entityTypeId: entityTypeId,
          publishStatusId: 1,
          brandId: brandId,
          attributes: [],
          photos: [],
          videos: [],
          inventories: [
            {
              vendorId: vendorId,
              qty: 5,
              firstPrice: 50000,
              vendorAddressId: vendorAddressId,
            },
          ],
        });

      expect(res.status).toBe(201);

      expect(res.body).toHaveProperty('statusCode', 201);
      expect(res.body).toHaveProperty('result');
      expect(res.body.result.title).toBe(uniqueTitle);
      expect(res.body.result.slug).toBe(uniqueSlug);
      expect(res.body.result).toHaveProperty('id');
      expect(res.body.result).toHaveProperty('sku');
      expect(res.body.result.sku).toContain(process.env.SKU_PREFIX || '');
      expect(res.body.result).toHaveProperty('brand');
      expect(res.body.result.brand.name).toBe('Test Brand');

      // track for cleanup in afterAll
      postCreatedProductId = Number(res.body.result.id);
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  UPDATE
  // ────────────────────────────────────────────────────────────────
  describe('PUT /v1/api/ecommerce/admin/products/:id', () => {
    it('should return 404 for non-existent id', async () => {
      const res = await request(app.getHttpServer())
        .put('/v1/api/ecommerce/admin/products/999999999')
        .set(authHeader())
        .send({
          title: 'Updated Title',
          slug: 'updated-slug-' + Date.now(),
          entityTypeId: entityTypeId,
          publishStatusId: 1,
          attributes: [],
          photos: [],
          videos: [],
          inventories: [],
        });
      expect(res.status).toBe(404);
    });

    it('should return 400 for empty body on existing product', async () => {
      await request(app.getHttpServer())
        .put(`/v1/api/ecommerce/admin/products/${productId2}`)
        .set(authHeader())
        .send({})
        .expect(400);
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  DELETE
  // ────────────────────────────────────────────────────────────────
  describe('DELETE /v1/api/ecommerce/admin/products/:id', () => {
    let deleteProductId: number;

    beforeAll(async () => {
      const p = await productModel.create({
        id: -(Date.now() + 3),
        title: 'To Delete',
        slug: 'to-delete-' + Date.now(),
        sku: 'DEL-' + Date.now(),
        entityTypeId: entityTypeId,
        brandId: brandId,
        publishStatusId: 1,
        inventoryStatusId: 1,
        userId: 1,
        viewCount: 0,
      } as any);
      deleteProductId = Number(p.id);
    });

    it('should soft-delete an existing product', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/v1/api/ecommerce/admin/products/${deleteProductId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(deleteProductId);

      // verify it's soft-deleted
      const deleted = await productModel.findOne({
        where: { id: deleteProductId },
      });
      expect(deleted.isDeleted).toBeTruthy();
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/products/999999999')
        .set(authHeader())
        .expect(404);
    });

    afterAll(async () => {
      await productModel.destroy({
        where: { id: deleteProductId },
        force: true,
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  SECURITY
  // ────────────────────────────────────────────────────────────────
  describe('security', () => {
    it('should fail with 403 if no auth token provided', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/products')
        .expect(403);

      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/products')
        .send({})
        .expect(403);

      await request(app.getHttpServer())
        .put('/v1/api/ecommerce/admin/products/1')
        .send({})
        .expect(403);

      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/products/1')
        .expect(403);
    });
  });
});
