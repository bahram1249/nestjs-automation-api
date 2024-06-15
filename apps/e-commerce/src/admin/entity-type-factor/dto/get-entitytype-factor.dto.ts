import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { EntityTypeDto } from './entity-type.dto';

export class GetEntityTypeFactorDto extends IntersectionType(
  ListFilter,
  EntityTypeDto,
) {}
