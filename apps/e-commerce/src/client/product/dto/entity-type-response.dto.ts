import { ApiProperty } from '@nestjs/swagger';

export class EntityTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Entity type ID' })
  id: number;

  @ApiProperty({ example: 'Electronics', description: 'Entity type name' })
  name: string;

  @ApiProperty({
    example: 'electronics',
    description: 'Entity type slug',
    required: false,
  })
  slug?: string;
}
