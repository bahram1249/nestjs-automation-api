import { ApiProperty } from '@nestjs/swagger';

export class PermissionGroupInfoResponseDto {
  @ApiProperty({ example: 1, description: 'Permission Group ID' })
  id: number;

  @ApiProperty({
    example: 'User Management',
    description: 'Permission group name',
  })
  permissionGroupName: string;
}
