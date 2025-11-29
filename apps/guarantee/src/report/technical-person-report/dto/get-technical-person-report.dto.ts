import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { TechnicalPersonReportDto } from './technical-person-report.dto';

export class GetTechnicalPersonReportDto extends IntersectionType(
  TechnicalPersonReportDto,
  ListFilter,
) {}
