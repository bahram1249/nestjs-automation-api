import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { VendorSaleDto } from './vendor-sale-dto';

export class GetVendorSaleDto extends IntersectionType(
  VendorSaleDto,
  ListFilter,
) {}
