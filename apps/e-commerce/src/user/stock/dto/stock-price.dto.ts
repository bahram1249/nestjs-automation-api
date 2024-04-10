import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StockPriceDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'addressId',
  })
  @IsNumber()
  addressId?: bigint;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'couponCode',
  })
  couponCode?: string;
}
