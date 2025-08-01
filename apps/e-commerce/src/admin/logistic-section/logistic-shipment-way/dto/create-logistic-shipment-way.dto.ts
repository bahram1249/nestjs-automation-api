import { IntersectionType } from '@nestjs/swagger';
import { CreateLogisticShipmentWayDetailDto } from './create-logistic-shipment-way-detail';

export class CreateLogisticShipmentWayDto extends IntersectionType(
  CreateLogisticShipmentWayDetailDto,
) {}
