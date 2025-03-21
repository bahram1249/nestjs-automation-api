import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GetSolutionRequestFilterDto } from './get-solution-request-filter.dto';

export class GetSolutionDto extends IntersectionType(
  ListFilter,
  GetSolutionRequestFilterDto,
) {}
