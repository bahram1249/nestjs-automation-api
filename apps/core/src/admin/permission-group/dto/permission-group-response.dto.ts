import { ApiProperty } from '@nestjs/swagger';
import { PermissionGroupPermissionResponseDto } from './permission-group-permission-response.dto';

export class PermissionGroupResponseDto {
  @ApiProperty({ example: 1, description: 'Permission Group ID' })
  id: number;

  @ApiProperty({
    example: 'User Management',
    description: 'Permission group name',
  })
  permissionGroupName: string;

  @ApiProperty({ example: 1, description: 'Order', required: false })
  order?: number;

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
    type: () => [PermissionGroupPermissionResponseDto],
    description: 'Permissions in this group',
    required: false,
  })
  permissions?: PermissionGroupPermissionResponseDto[];
}
