import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetShoppingPriceDto {
  @IsNumber()
  shoppingCartId: bigint;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'couponCode',
  })
  couponCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'latitude',
  })
  latitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'longitude',
  })
  longitude?: string;
}
