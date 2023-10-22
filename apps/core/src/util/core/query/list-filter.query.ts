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
  public offset = 0;

  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  public limit = 10;

  @IsOptional()
  public orderBy?: string = 'id';

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Transform(({ value }) => '%' + value + '%')
  public search?: string = '%%';
}
