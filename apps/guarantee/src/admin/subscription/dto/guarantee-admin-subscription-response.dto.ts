import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminSubscriptionResponseDto {
  @ApiProperty({ example: 1, description: 'Subscription ID' })
  id: number;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber?: string;

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
}
