import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { CourierReportDto } from './courier-report.dto';

export class GetCourierReportDto extends IntersectionType(
  CourierReportDto,
  ListFilter,
) {}
