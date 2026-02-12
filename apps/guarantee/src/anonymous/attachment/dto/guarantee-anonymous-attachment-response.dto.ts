import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAnonymousAttachmentResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', description: 'Attachment ID' },
      fileName: { type: 'string', description: 'File name' },
    },
    description: 'Uploaded attachment details',
  })
  result: {
    id: number;
    fileName: string;
  };
}
