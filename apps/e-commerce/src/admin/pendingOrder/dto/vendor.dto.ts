import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class VendorDto {
  @IsInt()
  @Type(() => Number)
  vendorId: number;
}
