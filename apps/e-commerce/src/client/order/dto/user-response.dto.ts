import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({ example: 'johndoe', description: 'Username', required: false })
  username?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;
}
