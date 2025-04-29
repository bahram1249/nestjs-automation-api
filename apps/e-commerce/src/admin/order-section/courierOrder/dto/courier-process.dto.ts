import { IsNumber, IsOptional } from 'class-validator';

export class CourierProcessDto {
  @IsNumber()
  @IsOptional()
  userId?: bigint;
}
