import { IntersectionType } from '@nestjs/swagger';
import { GetProductDto } from './get-product.dto';
import { LatLonFilter } from './lat-lon-filter.dto';

export class GetProductLatLonDto extends IntersectionType(
  GetProductDto,
  LatLonFilter,
) {}
