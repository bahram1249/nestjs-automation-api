import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ProductSaleFilterDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'beginDate',
  })
  @IsString()
  beginDate: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'endDate',
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'vendorId',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  vendorId?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'variationPriceId',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  variationPriceId?: number;
}
