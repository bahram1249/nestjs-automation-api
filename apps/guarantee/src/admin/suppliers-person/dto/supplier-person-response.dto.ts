import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminSupplierPersonUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: '09123456789', description: 'Username' })
  username: string;

  @ApiProperty({
    example: '1234567890',
    description: 'National code',
    required: false,
  })
  nationalCode?: string;
}

export class GuaranteeAdminSupplierPersonResponseDto {
  @ApiProperty({ example: 1, description: 'Supplier Person ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({
    type: () => GuaranteeAdminSupplierPersonUserResponseDto,
    description: 'User information',
    required: false,
  })
  user?: GuaranteeAdminSupplierPersonUserResponseDto;

  @ApiProperty({ example: 1, description: 'Organization ID' })
  organizationId: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;
}
