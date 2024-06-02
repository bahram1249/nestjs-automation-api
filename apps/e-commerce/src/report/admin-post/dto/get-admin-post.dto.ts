import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { AdminPostDto } from './admin-post.dto';

export class GetAdminPostDto extends IntersectionType(
  AdminPostDto,
  ListFilter,
) {}
