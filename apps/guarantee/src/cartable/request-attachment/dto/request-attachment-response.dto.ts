import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'file.jpg', description: 'File name' })
  fileName: string;
}

export class GuaranteeCartableRequestAttachmentTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment type ID' })
  id: number;

  @ApiProperty({ example: 'Type Title', description: 'Attachment type title' })
  title: string;
}

export class GuaranteeCartableUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', nullable: true })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', nullable: true })
  lastname?: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;
}

export class GuaranteeCartableRequestAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Request attachment ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Request ID' })
  requestId: bigint;

  @ApiProperty({ example: 1, description: 'Attachment type ID' })
  requestAttachmentTypeId: number;

  @ApiProperty({ example: 1, description: 'Attachment ID' })
  attachmentId: bigint;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;

  @ApiProperty({
    type: GuaranteeCartableAttachmentResponseDto,
    description: 'Attachment details',
  })
  attachment?: GuaranteeCartableAttachmentResponseDto;

  @ApiProperty({
    type: GuaranteeCartableRequestAttachmentTypeResponseDto,
    description: 'Attachment type details',
  })
  requestAttachmentType?: GuaranteeCartableRequestAttachmentTypeResponseDto;

  @ApiProperty({
    type: GuaranteeCartableUserResponseDto,
    description: 'User details',
  })
  user?: GuaranteeCartableUserResponseDto;
}

export class GuaranteeCartableRequestAttachmentListResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableRequestAttachmentResponseDto],
    description: 'List of request attachments',
  })
  result: GuaranteeCartableRequestAttachmentResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeCartableUploadImageResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      fileName: { type: 'string', example: 'file.jpg' },
    },
    description: 'Uploaded attachment details',
  })
  result: {
    id: bigint;
    fileName: string;
  };
}
