import { Module, Scope } from '@nestjs/common';
import { DISCOUNT_CONDITION_VALUE_PROVIDER_TOKEN } from './discount-condition-value.constants';
import { ServiceProviderFactory } from './factory';
import {
  EntityTypeMiddleService,
  InventoryMiddleService,
  ProductMiddleService,
  VendorMiddleService,
} from './services';
import { EntityTypeModule } from '@rahino/eav/admin/entity-type/entity-type.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { ProductModule } from '../../../product-section/product/product.module';
import { UserInventoryModule } from '@rahino/ecommerce/user/inventory/user-inventory.module';

@Module({
  imports: [
    EntityTypeModule,
    UserVendorModule,
    ProductModule,
    UserInventoryModule,
  ],
  providers: [
    {
      provide: DISCOUNT_CONDITION_VALUE_PROVIDER_TOKEN,
      scope: Scope.REQUEST,
      useFactory(providerFactory: ServiceProviderFactory) {
        return providerFactory.create();
      },
      inject: [ServiceProviderFactory],
    },
    ServiceProviderFactory,
    ProductMiddleService,
    EntityTypeMiddleService,
    InventoryMiddleService,
    VendorMiddleService,
  ],
  exports: [DISCOUNT_CONDITION_VALUE_PROVIDER_TOKEN],
})
export class ServiceProviderModule {}
