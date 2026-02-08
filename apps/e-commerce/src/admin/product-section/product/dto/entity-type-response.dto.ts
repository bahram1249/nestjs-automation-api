import { ApiProperty } from '@nestjs/swagger';

export class EntityTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Entity Type ID' })
  id: number;

  @ApiProperty({ example: 'Product', description: 'Entity type name' })
  name: string;
}
