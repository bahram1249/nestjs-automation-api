import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SelectedProductTypeFilter {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'selectedProductTypeId',
  })
  public selecetedProductTypeId?: number;
}
