import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { AdminLogisticCourierDto } from './admin-courier.dto';

export class GetBasedAdminCourierDto extends IntersectionType(
  AdminLogisticCourierDto,
  ListFilter,
) {}
