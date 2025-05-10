import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { IncomeReportDto } from './income-report-dto';

export class GetIncomeReportDto extends IntersectionType(
  IncomeReportDto,
  ListFilter,
) {}
