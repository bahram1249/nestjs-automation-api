import { ApiProperty } from '@nestjs/swagger';

export class UserRoleResponseDto {
  @ApiProperty({ example: 1, description: 'Role ID' })
  id: number;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  roleName: string;

  @ApiProperty({
    example: 1,
    description: 'Static role ID',
    required: false,
  })
  static_id?: number;

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
