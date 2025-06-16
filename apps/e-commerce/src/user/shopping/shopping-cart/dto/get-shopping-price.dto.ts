import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetShoppingPriceDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    type: IsNumber,
    description: 'shoppingCartId',
  })
  shoppingCartId: bigint;

  @IsString()
  @ApiProperty({
    type: IsString,
    description: 'couponCode',
  })
  couponCode?: string;

  @IsString()
  @ApiProperty({
    type: IsString,
    description: 'latitude',
  })
  latitude?: string;

  @IsString()
  @ApiProperty({
    type: IsString,
    description: 'longitude',
  })
  longitude?: string;
}
