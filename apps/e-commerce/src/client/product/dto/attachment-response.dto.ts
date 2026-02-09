import { ApiProperty } from '@nestjs/swagger';

export class ClientProductAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: number;

  @ApiProperty({ example: 'uuid.jpg', description: 'File name' })
  fileName: string;
}
