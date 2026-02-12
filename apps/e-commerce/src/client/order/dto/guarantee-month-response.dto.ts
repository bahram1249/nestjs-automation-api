import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeMonthResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee month ID' })
  id: number;

  @ApiProperty({ example: '12 Months', description: 'Guarantee month name' })
  name: string;
}
