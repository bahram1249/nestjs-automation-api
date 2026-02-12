import { ApiProperty } from '@nestjs/swagger';

export class GoldPriceItemResponseDto {
  @ApiProperty({
    example: 'طلای ۱۸ عیار ۷۵۰',
    description: 'Gold type label in Persian',
  })
  key: string;

  @ApiProperty({
    example: '2850000',
    description: 'Gold price value',
  })
  value: string;
}
