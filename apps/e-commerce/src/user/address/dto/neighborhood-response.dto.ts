import { ApiProperty } from '@nestjs/swagger';

export class NeighborhoodResponseDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({ example: 'Valiasr', description: 'Neighborhood name' })
  name: string;
}
