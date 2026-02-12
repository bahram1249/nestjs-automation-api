import { ApiProperty } from '@nestjs/swagger';

export class EntityTypeSortResponseDto {
  @ApiProperty({ example: 1, description: 'Entity Type Sort ID' })
  id: number;

  @ApiProperty({ example: 'Sort by Price', description: 'Title' })
  title: string;

  @ApiProperty({ example: 'price', description: 'Sort Field' })
  sortField: string;

  @ApiProperty({ example: 'ASC', description: 'Sort Order' })
  sortOrder: string;
}
