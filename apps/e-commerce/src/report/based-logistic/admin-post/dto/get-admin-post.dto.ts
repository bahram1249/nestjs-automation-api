import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { AdminLogisticPostDto } from './admin-post.dto';

export class GetBasedAdminPostDto extends IntersectionType(
  AdminLogisticPostDto,
  ListFilter,
) {}
