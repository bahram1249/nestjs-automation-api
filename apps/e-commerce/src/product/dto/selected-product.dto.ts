import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class SelectedProductDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'selectedProductId',
  })
  selectedProductId?: number;
}
