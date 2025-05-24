import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GetOrganizationDetailDto } from './get-organization-detail.dto';

export class GetOrganizationDto extends IntersectionType(
  ListFilter,
  GetOrganizationDetailDto,
) {}
