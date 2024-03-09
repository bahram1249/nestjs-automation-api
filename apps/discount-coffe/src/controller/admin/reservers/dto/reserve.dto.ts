import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ReserveDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => JSON.parse(value))
  reserveId?: number;
}
