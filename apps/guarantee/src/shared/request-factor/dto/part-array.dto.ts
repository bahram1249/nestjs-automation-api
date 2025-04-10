import { IsNumber, IsString } from 'class-validator';

export class PartArrayDto {
  @IsString()
  partName: string;
  @IsNumber()
  warrantyServiceType: number;

  @IsNumber()
  price: number;

  @IsNumber()
  qty: number;
}
