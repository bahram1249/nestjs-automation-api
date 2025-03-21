import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GetCartableFilteDto } from './get-cartable-filter.dto';

export class GetCartableDto extends IntersectionType(
  ListFilter,
  GetCartableFilteDto,
) {}
