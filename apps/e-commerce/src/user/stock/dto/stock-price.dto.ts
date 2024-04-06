import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class StockPriceDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'addressId',
  })
  @IsInt()
  @Type(() => Number)
  addressId: bigint;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString(),
    description: 'coupunCode',
  })
  coupunCode: string;
}
