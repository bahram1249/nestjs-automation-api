import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class BuffetFilterDto {
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  @IsOptional()
  buffetTypeId?: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  @IsOptional()
  buffetCostId?: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  @IsOptional()
  buffetCityId?: number;

  @IsOptional()
  order?: string = 'desc';
  @IsOptional()
  orderBy?: string = 'id';
}
