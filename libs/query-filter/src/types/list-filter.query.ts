import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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
    default: 0,
    type: IsNumber,
    description: 'skip item',
  })
  public offset = 0;

  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
    description: 'how many item returned.',
    type: IsNumber,
  })
  public limit = 10;

  @IsOptional()
  @ApiProperty({
    default: 'id',
    required: false,
    type: IsString,
    description: 'orderBy field',
  })
  public orderBy?: string = 'id';

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({
    type: IsString,
    enum: SortOrder,
    default: SortOrder.DESC,
    description: 'sort order',
    required: false,
  })
  public sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @ApiProperty({ required: false, type: IsString, default: '' })
  @Transform(({ value }) => '%' + value + '%')
  public search?: string = '%%';
}
