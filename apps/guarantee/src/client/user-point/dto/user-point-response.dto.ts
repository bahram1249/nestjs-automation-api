import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientUserPointPointResponseDto {
  @ApiProperty({ example: 1, description: 'Point ID' })
  id: bigint;

  @ApiProperty({ example: 'Registration Bonus', description: 'Point title' })
  title: string;
}

export class GuaranteeClientUserPointResponseDto {
  @ApiProperty({ example: 1, description: 'User Point ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Point ID' })
  pointId: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 10.5, description: 'Point score' })
  pointScore: number;

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
    type: () => GuaranteeClientUserPointPointResponseDto,
    description: 'Point',
    required: false,
  })
  point?: GuaranteeClientUserPointPointResponseDto;
}
