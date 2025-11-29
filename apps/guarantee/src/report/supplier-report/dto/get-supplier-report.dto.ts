import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { SupplierReportDto } from './supplier-report.dto';

export class GetSupplierReportDto extends IntersectionType(
  SupplierReportDto,
  ListFilter,
) {}
