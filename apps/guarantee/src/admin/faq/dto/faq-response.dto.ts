import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminFaqResponseDto {
  @ApiProperty({ example: 1, description: 'FAQ ID' })
  id: number;

  @ApiProperty({ example: 'What is this?', description: 'FAQ question' })
  question: string;

  @ApiProperty({ example: 'This is the answer.', description: 'FAQ answer' })
  answer: string;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priority?: number;

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
