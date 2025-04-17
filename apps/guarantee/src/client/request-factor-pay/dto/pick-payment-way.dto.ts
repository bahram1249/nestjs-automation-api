import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { PickPaymentWayDetailDto } from './pick-payment-way-detail.dto';

export class PickPaymentWayDto extends IntersectionType(
  GuaranteeTraverseDto,
  PickPaymentWayDetailDto,
) {}
