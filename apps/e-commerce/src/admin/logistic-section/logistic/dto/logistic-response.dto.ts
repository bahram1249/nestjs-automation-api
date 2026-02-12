import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
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

export class LogisticUserResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic User ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: bigint;

  @ApiProperty({
    example: true,
    description: 'Is default user',
    required: false,
  })
  isDefault?: boolean;

  @ApiProperty({
    description: 'User information',
    type: () => UserInfoResponseDto,
  })
  user?: UserInfoResponseDto;
}

export class LogisticResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic ID' })
  id: bigint;

  @ApiProperty({ example: 'Fast Delivery', description: 'Logistic title' })
  title: string;

  @ApiProperty({
    description: 'Default logistic user',
    type: () => LogisticUserResponseDto,
    required: false,
  })
  logisticUser?: LogisticUserResponseDto;
}

export class LogisticDeleteResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic ID' })
  id: bigint;

  @ApiProperty({ example: 'Fast Delivery', description: 'Logistic title' })
  title: string;
}
