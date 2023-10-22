import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListFilter {
  @Transform(({ value }) => Math.max(Number(value), 0))
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    required: false,
    type: IsNumber,
  })
  public offset = 0;

  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    maximum: 100,
    required: false,
    type: IsNumber,
  })
  public limit = 10;

  @IsOptional()
  @ApiProperty({
    default: 'id',
    required: false,
  })
  public orderBy?: string = 'id';

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({
    enum: SortOrder,
    default: SortOrder.DESC,
    required: false,
  })
  public sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Transform(({ value }) => '%' + value + '%')
  @ApiProperty({ required: false })
  public search?: string = '%%';
}
