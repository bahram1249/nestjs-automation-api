import { Module } from '@nestjs/common';
import { VendorAddressController } from './vendor-address.controller';
import { VendorAddressService } from './vendor-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { AddressModule } from '@rahino/ecommerce/user/address/address.module';
import { ECVendorAddress } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';

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
