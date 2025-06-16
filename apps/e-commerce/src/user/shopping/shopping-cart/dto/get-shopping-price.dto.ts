import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetShoppingPriceDto {
  @IsNumber()
  shoppingCartId: bigint;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: IsString,
    description: 'couponCode',
  })
  couponCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: IsString,
    description: 'latitude',
  })
  latitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: IsString,
    description: 'longitude',
  })
  longitude?: string;
}
