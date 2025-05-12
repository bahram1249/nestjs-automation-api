import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class SelectedProductItemDto {
  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'productId',
  })
  public productId?: bigint;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'selectedProductId',
  })
  public selectedProductId?: number;
}
