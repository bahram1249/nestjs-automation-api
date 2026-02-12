import { ApiProperty } from '@nestjs/swagger';

export class AdminProductBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  name: string;
}
