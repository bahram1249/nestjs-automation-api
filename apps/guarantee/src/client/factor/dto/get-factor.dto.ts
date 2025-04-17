import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GetFactorDetailDto } from './get-factor-detail.dto';

export class GetFactorDto extends IntersectionType(
  ListFilter,
  GetFactorDetailDto,
) {}
