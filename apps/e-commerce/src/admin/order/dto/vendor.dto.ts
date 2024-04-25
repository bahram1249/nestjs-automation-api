import { IsNumber } from 'class-validator';

export class VendorDto {
  @IsNumber()
  vendorId: number;
}
