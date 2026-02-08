import { ApiProperty } from '@nestjs/swagger';

export class CurrentPriceDetailResponseDto {
  @ApiProperty({
    example: 2850000,
    description: 'Current gold price',
  })
  currentPrice: number;

  @ApiProperty({
    example: true,
    description: 'Whether the automatic price update job is enabled',
  })
  currentPriceJobStatus: boolean;

  @ApiProperty({
    example: 50000,
    description: 'Static profit amount for gold',
  })
  goldStaticProfit: number;

  @ApiProperty({
    example: 5,
    description: 'Gold profit percentage',
  })
  goldProfit: number;

  @ApiProperty({
    example: 9,
    description: 'Gold tax percentage',
  })
  goldTax: number;
}
