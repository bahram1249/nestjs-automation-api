import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: number;

  @ApiProperty({ example: 'photo.jpg', description: 'Original file name' })
  originalFileName: string;

  @ApiProperty({ example: 'uuid.jpg', description: 'File name' })
  fileName: string;

  @ApiProperty({ example: 'image/jpeg', description: 'MIME type' })
  mimetype: string;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Update timestamp',
  })
  updatedAt: Date;
}
