import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminSuperVisorUserResponseUserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber?: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'National code',
    required: false,
  })
  nationalCode?: string;
}

export class GuaranteeAdminSuperVisorUserResponseDto {
  @ApiProperty({ example: 1, description: 'Supervisor User ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: number;

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

  @ApiProperty({
    type: () => GuaranteeAdminSuperVisorUserResponseUserDto,
    description: 'User',
    required: false,
  })
  user?: GuaranteeAdminSuperVisorUserResponseUserDto;
}
