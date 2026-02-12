import { ApiProperty } from '@nestjs/swagger';
import { PermissionGroupInfoResponseDto } from './permission-group-info-response.dto';

export class AdminPermissionResponseDto {
  @ApiProperty({ example: 1, description: 'Permission ID' })
  id: number;

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
    example: 'core.admin.users.getall',
    description: 'Permission symbol',
  })
  permissionSymbol: string;

  @ApiProperty({
    example: 'GET',
    description: 'Permission method',
    required: false,
  })
  permissionMethod?: string;

  @ApiProperty({
    example: 1,
    description: 'Permission group ID',
    required: false,
  })
  permissionGroupId?: number;

  @ApiProperty({ example: 1, description: 'Visibility flag', required: false })
  visibility?: number;

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

  @ApiProperty({
    type: () => PermissionGroupInfoResponseDto,
    description: 'Permission group',
    required: false,
  })
  permissionGroup?: PermissionGroupInfoResponseDto;
}
