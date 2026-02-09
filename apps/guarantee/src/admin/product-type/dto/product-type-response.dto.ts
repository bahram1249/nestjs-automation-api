import { ApiProperty } from '@nestjs/swagger';
import { GSProvider } from '@rahino/localdatabase/models';

export class GuaranteeAdminProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Product Type ID' })
  id: number;

  @ApiProperty({
    example: 'Product Type Title',
    description: 'Product type title',
  })
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
    example: true,
    description: 'Mandatory attendance',
    required: false,
  })
  mandatoryAttendance?: boolean;

  @ApiProperty({
    example: 'Product type description',
    description: 'Product type description',
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
