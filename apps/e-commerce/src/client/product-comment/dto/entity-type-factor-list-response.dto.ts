import { ApiProperty } from '@nestjs/swagger';
import { EntityTypeFactorResponseDto } from './entity-type-factor-response.dto';

export class EntityTypeFactorListResponseDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: number;

  @ApiProperty({ example: 'Quality', description: 'Factor name' })
  name: string;

  @ApiProperty({ example: 1, description: 'Entity type ID' })
  entityTypeId: number;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priority?: number;
}
