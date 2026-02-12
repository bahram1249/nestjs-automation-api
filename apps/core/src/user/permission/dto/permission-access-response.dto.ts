import { ApiProperty } from '@nestjs/swagger';

export class PermissionAccessResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether user has access to the permission',
  })
  isAccess: boolean;
}
