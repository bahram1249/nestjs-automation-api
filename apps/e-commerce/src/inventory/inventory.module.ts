import { Module } from '@nestjs/common';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { InventoryValidationService } from './inventory-validation.service';
import { VendorAddressModule } from '@rahino/ecommerce/vendor-address/vendor-address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { InventoryProfile } from './mapper';
import { InventoryService } from './inventory.service';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECInventory,
      ECInventoryPrice,
      ECVariationPrice,
      ECColor,
      ECGuarantee,
      ECGuaranteeMonth,
      ECProvince,
    ]),
    UserVendorModule,
    VendorAddressModule,
  ],
  providers: [InventoryValidationService, InventoryService, InventoryProfile],
  exports: [InventoryValidationService, InventoryService],
})
export class InventoryModule {}
