import { ApiProperty } from '@nestjs/swagger';
import { AttachmentResponseDto } from './attachment-response.dto';

export class ParentEntityTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Entity type ID' })
  id: number;

  @ApiProperty({ example: 'Electronics', description: 'Entity type name' })
  name: string;

  @ApiProperty({ example: 'electronics', description: 'Entity type slug' })
  slug: string;

  @ApiProperty({
    description: 'Attachment information',
    required: false,
    type: AttachmentResponseDto,
  })
  attachment?: AttachmentResponseDto;
}
