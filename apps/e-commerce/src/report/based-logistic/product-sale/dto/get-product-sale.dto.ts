import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { ProductSaleFilterDto } from './product-sale-filter.dto';

export class GetProductSaleDto extends IntersectionType(
  ProductSaleFilterDto,
  ListFilter,
) {}
