import { IntersectionType } from '@nestjs/swagger';
import { GetNearByVendorDetailDto } from './get-nearbyby-vendor-detail.dto';
import { ListFilter } from '@rahino/query-filter';

export class GetNearbyVendorDto extends IntersectionType(
  ListFilter,
  GetNearByVendorDetailDto,
) {}
