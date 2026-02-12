import { ApiProperty } from '@nestjs/swagger';

export class LogisticResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic ID' })
  id: number;

  @ApiProperty({ example: 'Logistic Title', description: 'Logistic title' })
  title: string;
}
