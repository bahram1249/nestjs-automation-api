import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { LogisticShipmentWayDto } from './logistic-shipment-way.dto';

export class GetLogisticSendingPeriodDto extends IntersectionType(
  ListFilter,
  LogisticShipmentWayDto,
) {}
