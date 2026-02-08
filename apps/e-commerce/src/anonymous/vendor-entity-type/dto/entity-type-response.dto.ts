import { ApiProperty } from '@nestjs/swagger';
import { AttachmentResponseDto } from './attachment-response.dto';
import { EntityModelResponseDto } from './entity-model-response.dto';
import { ParentEntityTypeResponseDto } from './parent-entity-type-response.dto';
import { SubEntityTypeResponseDto } from './sub-entity-type-response.dto';

export class EntityTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Entity type ID' })
  id: number;

  @ApiProperty({ example: 'Electronics', description: 'Entity type name' })
  name: string;

  @ApiProperty({ example: 'electronics', description: 'Entity type slug' })
  slug: string;

  @ApiProperty({
    example: 1,
    description: 'Parent entity type ID',
    required: false,
  })
  parentEntityTypeId?: number;

  @ApiProperty({ example: 1, description: 'Entity model ID' })
  entityModelId: number;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priority?: number;

  @ApiProperty({
    example: true,
    description: 'Show on landing page',
    required: false,
  })
  showLanding?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the entity type is deleted',
    required: false,
  })
  isDeleted?: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update date',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Attachment information',
    required: false,
    type: AttachmentResponseDto,
  })
  attachment?: AttachmentResponseDto;

  @ApiProperty({
    description: 'Entity model information',
    required: false,
    type: EntityModelResponseDto,
  })
  entityModel?: EntityModelResponseDto;

  @ApiProperty({
    description: 'Parent entity type information',
    required: false,
    type: ParentEntityTypeResponseDto,
  })
  parentEntityType?: ParentEntityTypeResponseDto;

  @ApiProperty({
    description: 'Sub-entity types',
    required: false,
    type: [SubEntityTypeResponseDto],
  })
  subEntityTypes?: SubEntityTypeResponseDto[];
}
