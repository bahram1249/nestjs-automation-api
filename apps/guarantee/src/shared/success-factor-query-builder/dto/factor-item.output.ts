import { ApiProperty } from '@nestjs/swagger';

export class GSFactorItemOutputDto {
  @ApiProperty({
    example: 'Service Title',
    description: 'Item title',
    required: false,
  })
  public title?: string;

  @ApiProperty({ example: 100000, description: 'Item price' })
  public price: bigint;

  @ApiProperty({ example: 1, description: 'Item quantity' })
  public qty: number;
}
