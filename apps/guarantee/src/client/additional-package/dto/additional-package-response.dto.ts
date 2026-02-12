import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientAdditionalPackageResponseDto {
  @ApiProperty({ example: 1, description: 'Additional Package ID' })
  id: number;

  @ApiProperty({ example: 'Basic Package', description: 'Package title' })
  title: string;

  @ApiProperty({ example: 100000, description: 'Price' })
  price: bigint;

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
