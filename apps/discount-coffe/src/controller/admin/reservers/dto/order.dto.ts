import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class OrderDto {
  @IsNumber()
  @Transform(({ value }) => JSON.parse(value))
  reserveId?: number;

  @IsNumber()
  @Transform(({ value }) => JSON.parse(value))
  buffetId?: number;
}
