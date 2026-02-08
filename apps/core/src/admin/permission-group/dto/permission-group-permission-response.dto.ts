import { ApiProperty } from '@nestjs/swagger';

export class PermissionGroupPermissionResponseDto {
  @ApiProperty({ example: 1, description: 'Permission ID' })
  id: number;

  @ApiProperty({
    example: 'core.admin.users.getall',
    description: 'Permission symbol',
  })
  permissionSymbol: string;

  @ApiProperty({
    example: 'Get All Users',
    description: 'Permission name',
    required: false,
  })
  permissionName?: string;

  @ApiProperty({
    example: '/api/core/admin/users',
    description: 'Permission URL',
    required: false,
  })
  permissionUrl?: string;

  @ApiProperty({
    example: 'GET',
    description: 'Permission method',
    required: false,
  })
  permissionMethod?: string;

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
