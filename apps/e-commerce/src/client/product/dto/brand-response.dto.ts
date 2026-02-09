import { ApiProperty } from '@nestjs/swagger';

export class ClientProductBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  name: string;

  @ApiProperty({ example: 'apple', description: 'Brand slug', required: false })
  slug?: string;
}
