import { IntersectionType } from '@nestjs/swagger';
import { AddressDto } from '@rahino/ecommerce/user/address/dto';
import { VendorIdDto } from '@rahino/ecommerce/vendor-address/dto/vendorId.dto';

export class VendorAddressDto extends IntersectionType(
  AddressDto,
  VendorIdDto,
) {}
