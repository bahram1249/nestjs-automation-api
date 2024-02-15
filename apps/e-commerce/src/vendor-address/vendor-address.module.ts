import { Module } from '@nestjs/common';
import { VendorAddressController } from './vendor-address.controller';
import { VendorAddressService } from './vendor-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendorUser } from '@rahino/database/models/ecommerce-eav/ec-vendor-user.entity';
import { AddressModule } from '@rahino/ecommerce/user/address/address.module';
import { ECVendorAddress } from '@rahino/database/models/ecommerce-eav/ec-vendor-address.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';

@Module({
  imports: [
    AddressModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      ECVendorUser,
      ECVendorAddress,
    ]),
  ],
  controllers: [VendorAddressController],
  providers: [VendorAddressService],
  exports: [VendorAddressService],
})
export class VendorAddressModule {}
