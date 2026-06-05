import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { ProductModule } from './product.module';
import { getModelToken } from '@nestjs/sequelize';
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
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

async function run() {
  const app = await createE2EApp({ imports: [ProductModule] });
  const vendorModel = app.get<typeof ECVendor>(getModelToken(ECVendor));
  const vendorUserModel = app.get<typeof ECVendorUser>(
    getModelToken(ECVendorUser),
  );
  const addressModel = app.get<typeof ECAddress>(getModelToken(ECAddress));
  const vendorAddressModel = app.get<typeof ECVendorAddress>(
    getModelToken(ECVendorAddress),
  );
  const productModel = app.get<typeof ECProduct>(getModelToken(ECProduct));
  const brandModel = app.get<typeof ECBrand>(getModelToken(ECBrand));
  const entityTypeModel = app.get<typeof EAVEntityType>(
    getModelToken(EAVEntityType),
  );

  try {
    const publishStatus = await ECPublishStatus.findOne({ where: { id: 1 } });
    const inventoryStatus = await ECInventoryStatus.findOne({
      where: { id: 1 },
    });
    const variationPrice = await ECVariationPrice.findOne({ where: { id: 1 } });
    const testUser = await User.findOne({ where: { id: 1 } });
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
    const brand = await brandModel.create({
      name: 'Test Brand',
      slug: 'test-brand-' + Date.now(),
    } as any);
    console.log('brand created:', brand.id);
    const vendor = await vendorModel.create({
      name: 'Test Vendor',
      slug: 'test-vendor-' + Date.now(),
    } as any);
    console.log('vendor created:', vendor.id);
    const vu = await vendorUserModel.create({
      userId: 1,
      vendorId: Number(vendor.id),
    } as any);
    console.log('vendorUser created:', vu.id);
    const address = await addressModel.create({
      name: 'Test Address',
      latitude: '35.6892',
      longitude: '51.3890',
      provinceId: 1,
      cityId: 1,
    } as any);
    console.log('address created:', address.id);
    const va = await vendorAddressModel.create({
      vendorId: Number(vendor.id),
      addressId: Number(address.id),
    } as any);
    console.log('vendorAddress created:', va.id);
    const prod = await productModel.create({
      id: -(Date.now() + 1),
      title: 'Test Product',
      slug: 'test-product-' + Date.now(),
      sku: 'TST-' + Date.now(),
      entityTypeId: entityType.id,
      brandId: brand.id,
      publishStatusId: 1,
      inventoryStatusId: 1,
      userId: 1,
      viewCount: 0,
    } as any);
    console.log('product created:', prod.id);
    console.log('SUCCESS');
  } catch (e) {
    console.error('ERROR:', e.message || e);
    if (e.original)
      console.error('Original:', e.original.message || e.original);
  }
  await app.close();
}
run().catch((e) => console.error('UNCAUGHT:', e));
