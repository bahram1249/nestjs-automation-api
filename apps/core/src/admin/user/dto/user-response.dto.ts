import { ApiProperty } from '@nestjs/swagger';
import { UserRoleResponseDto } from './user-role-response.dto';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
    required: false,
  })
  email?: string;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({
    example: '+989123456789',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: true,
    description: 'Whether user must change password',
    required: false,
  })
  mustChangePassword?: boolean;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Last password change date',
    required: false,
  })
  lastPasswordChangeDate?: Date;

  @ApiProperty({
    example: 1,
    description: 'Profile photo attachment ID',
    required: false,
  })
  profilePhotoAttachmentId?: number;

  @ApiProperty({
    example: 1,
    description: 'Static user ID',
    required: false,
  })
  static_id?: number;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date',
    required: false,
  })
  birthDate?: Date;

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
    type: () => [UserRoleResponseDto],
    description: 'User roles',
    required: false,
  })
  roles?: UserRoleResponseDto[];
}
