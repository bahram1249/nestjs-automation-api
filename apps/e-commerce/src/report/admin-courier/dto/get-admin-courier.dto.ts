import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { AdminCourierDto } from './admin-courier.dto';

export class GetAdminCourierDto extends IntersectionType(
  AdminCourierDto,
  ListFilter,
) {}
