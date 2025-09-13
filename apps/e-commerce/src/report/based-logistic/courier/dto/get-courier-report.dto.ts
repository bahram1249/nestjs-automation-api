import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { BasedCourierReportDto } from './courier-report.dto';

export class GetBasedCourierReportDto extends IntersectionType(
  BasedCourierReportDto,
  ListFilter,
) {}
