import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;
}

export class LogisticUserResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic User ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: bigint;

  @ApiProperty({
    description: 'User information',
    type: () => UserInfoResponseDto,
  })
  user?: UserInfoResponseDto;
}
