import { ApiProperty } from '@nestjs/swagger';
import { GSProvider } from '@rahino/localdatabase/models';

export class GuaranteeAdminVariantResponseDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Title', description: 'Variant title' })
  title: string;

  @ApiProperty({ example: 1, description: 'Provider ID', required: false })
  providerId?: number;

  @ApiProperty({
    type: () => GSProvider,
    description: 'Provider',
    required: false,
  })
  provider?: GSProvider;

  @ApiProperty({
    example: 'Variant description',
    description: 'Variant description',
    required: false,
  })
  description?: string;

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
