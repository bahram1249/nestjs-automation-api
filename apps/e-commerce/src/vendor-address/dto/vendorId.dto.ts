import { IsNumber } from 'class-validator';

export class VendorIdDto {
  @IsNumber()
  vendorId: number;
}
