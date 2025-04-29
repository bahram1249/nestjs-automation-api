import { IntersectionType } from '@nestjs/swagger';
import { DiscountDto } from './discount.dto';
import { VendorDto } from './vendor.dto';

export class CreateDiscountDto extends IntersectionType(
  DiscountDto,
  VendorDto,
) {}
