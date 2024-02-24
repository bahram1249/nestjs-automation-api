import { IntersectionType } from '@nestjs/swagger';
import { AddressDto } from '@rahino/ecommerce/user/address/dto';
import { RequiredVendorIdDto } from './required-vendorId.dto';

export class VendorAddressDto extends IntersectionType(
  AddressDto,
  RequiredVendorIdDto,
) {}
