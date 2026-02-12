import { ApiProperty } from '@nestjs/swagger';

export class PriceFormulaResponseDto {
  @ApiProperty({ example: 1, description: 'Price formula ID' })
  id: number;

  @ApiProperty({ example: 'Gold Price Formula', description: 'Formula title' })
  title: string;
}
