import { IntersectionType } from '@nestjs/swagger';
import { VendorDto } from './vendor.dto';
import { ListFilter } from '@rahino/query-filter';

export class GetOrderDto extends IntersectionType(VendorDto, ListFilter) {}
