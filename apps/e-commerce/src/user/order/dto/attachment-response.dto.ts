import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'image.jpg', description: 'File name' })
  fileName: string;
}
