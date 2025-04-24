import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GetCartableFilteDto } from './get-cartable-filter.dto';
import { GetClientSideCartableDto } from './get-client-side-cartable.dto';

export class GetCartableDto extends IntersectionType(
  ListFilter,
  GetCartableFilteDto,
  GetClientSideCartableDto,
) {}
