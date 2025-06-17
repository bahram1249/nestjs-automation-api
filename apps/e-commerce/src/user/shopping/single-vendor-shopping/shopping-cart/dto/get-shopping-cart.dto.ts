import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class GetShoppingCartDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'vendorId',
  })
  vendorId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'shoppingCartId',
  })
  shoppingCartId?: bigint;
}
