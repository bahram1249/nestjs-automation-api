import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({ example: 'abc123', description: 'Session ID' })
  id: string;

  @ApiProperty({ example: 1, description: 'User ID', required: true })
  userId?: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Session expiration date',
  })
  expireAt: Date;
}
