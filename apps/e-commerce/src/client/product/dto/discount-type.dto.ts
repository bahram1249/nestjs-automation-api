import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class DiscountTypeDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'discountTypeId',
  })
  discountTypeId?: number;
}
