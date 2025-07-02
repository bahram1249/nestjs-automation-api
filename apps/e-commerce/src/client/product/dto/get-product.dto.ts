import { IntersectionType } from '@nestjs/swagger';
import { PriceFilterDto } from './price.filter';
import { GetUnPriceDto } from './get-unprice.dto';

export class GetProductDto extends IntersectionType(
  GetUnPriceDto,
  PriceFilterDto,
) {}
