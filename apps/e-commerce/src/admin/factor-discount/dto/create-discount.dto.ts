import { IntersectionType } from '@nestjs/swagger';
import { FactorDiscountDto } from './factor-discount.dto';

export class CreateDiscountDto extends IntersectionType(FactorDiscountDto) {}
