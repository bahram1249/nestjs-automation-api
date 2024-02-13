import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { VendorIdDto } from './vendorId.dto';
export class GetVendorAddressDto extends IntersectionType(
  ListFilter,
  VendorIdDto,
) {}
