import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { PickShipmentWayDetailDto } from './pick-shipment-way-detail.dto';
import { RequestItemDto } from './request-item.dto';

export class PickShipmentWayDto extends IntersectionType(
  GuaranteeTraverseDto,
  PickShipmentWayDetailDto,
) {}
