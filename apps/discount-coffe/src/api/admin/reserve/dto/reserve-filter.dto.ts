import { IntersectionType } from '@nestjs/swagger';
import { ReserveDto } from '@rahino/discountCoffe/controller/admin/reservers/dto';
import { ListFilter } from '@rahino/query-filter';

export class ReserveFilterDto extends IntersectionType(
  ListFilter,
  ReserveDto,
) {}
