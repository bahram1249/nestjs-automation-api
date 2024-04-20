import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @Transform((item) =>
    typeof item.value.map === 'function'
      ? item.value.map((v) => parseInt(v, 10))
      : [parseInt(item.value, 10)],
  )
  @IsInt({ each: true })
  coffeOptionIds?: number[] = [];

  @IsOptional()
  latitude?: string;

  @IsOptional()
  longitude?: string;

  @IsOptional()
  @ApiProperty({ required: false, type: IsString, default: '' })
  @Transform(({ value }) => '%' + value + '%')
  public search?: string = '%%';
}
