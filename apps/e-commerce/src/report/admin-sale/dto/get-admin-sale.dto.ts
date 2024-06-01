import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { AdminSaleDto } from './admin-sale-dto';

export class GetAdminSaleDto extends IntersectionType(
  AdminSaleDto,
  ListFilter,
) {}
