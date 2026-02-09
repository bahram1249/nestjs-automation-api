import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminIrangsImportStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Status ID' })
  id: number;

  @ApiProperty({ example: 'Pending', description: 'Status title' })
  title: string;
}

export class GuaranteeAdminIrangsImportUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname?: string;
}

export class GuaranteeAdminIrangsImportDataResponseDto {
  @ApiProperty({ example: 1, description: 'Import Data ID' })
  id: bigint;

  @ApiProperty({ example: 'import.xlsx', description: 'File name' })
  fileName: string;

  @ApiProperty({ example: 1, description: 'Status ID' })
  statusId: number;

  @ApiProperty({
    type: GuaranteeAdminIrangsImportStatusResponseDto,
    description: 'Import status',
    required: false,
  })
  status?: GuaranteeAdminIrangsImportStatusResponseDto;

  @ApiProperty({ example: 100, description: 'Total rows' })
  totalRows: number;

  @ApiProperty({ example: 50, description: 'Processed rows' })
  processedRows: number;

  @ApiProperty({
    example: 'Error message',
    description: 'Error message',
    required: false,
  })
  error?: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({
    type: GuaranteeAdminIrangsImportUserResponseDto,
    description: 'User',
    required: false,
  })
  user?: GuaranteeAdminIrangsImportUserResponseDto;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class GuaranteeAdminIrangsImportDataListResponseDto {
  @ApiProperty({
    type: [GuaranteeAdminIrangsImportDataResponseDto],
    description: 'List of import data',
  })
  result: GuaranteeAdminIrangsImportDataResponseDto[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}

export class GuaranteeAdminIrangsImportDataUploadResponseDto {
  @ApiProperty({
    example: 'File uploaded and queued for processing.',
    description: 'Message',
  })
  message: string;
}
