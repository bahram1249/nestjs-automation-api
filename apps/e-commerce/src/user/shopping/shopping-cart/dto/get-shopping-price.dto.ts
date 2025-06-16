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

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    type: IsNumber,
    description: 'addressId',
  })
  addressId?: bigint;
}
