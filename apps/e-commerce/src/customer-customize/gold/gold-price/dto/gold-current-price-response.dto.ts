import { ApiProperty } from '@nestjs/swagger';

export class GoldCurrentPriceResponseDto {
  @ApiProperty({
    example: '2850000',
    description: 'Current gold price value',
  })
  result: string;
}
