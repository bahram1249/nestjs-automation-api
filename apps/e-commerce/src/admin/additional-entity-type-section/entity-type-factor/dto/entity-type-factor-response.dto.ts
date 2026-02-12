import { ApiProperty } from '@nestjs/swagger';

export class EntityTypeFactorResponseDto {
  @ApiProperty({ example: 1, description: 'Entity Type Factor ID' })
  id: number;

  @ApiProperty({ example: 'Factor Name', description: 'Name' })
  name: string;

  @ApiProperty({ example: 1, description: 'Entity Type ID' })
  entityTypeId: number;

  @ApiProperty({ example: 10, description: 'Priority', required: false })
  priority?: number;
}
