import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminAdditionalPackageResponseDto {
  @ApiProperty({ example: 1, description: 'Additional Package ID' })
  id: number;

  @ApiProperty({ example: 'Package Title', description: 'Package title' })
  title: string;

  @ApiProperty({ example: 100000, description: 'Package price' })
  price: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class GuaranteeAdminAdditionalPackageUnitPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Unit Price ID' })
  id: number;

  @ApiProperty({ example: 'Toman', description: 'Unit price title' })
  title: string;
}

export class GuaranteeAdminAdditionalPackageWithUnitPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Additional Package ID' })
  id: number;

  @ApiProperty({ example: 'Package Title', description: 'Package title' })
  title: string;

  @ApiProperty({ example: 100000, description: 'Package price' })
  price: bigint;

  @ApiProperty({
    type: GuaranteeAdminAdditionalPackageUnitPriceResponseDto,
    description: 'Unit price',
    required: false,
  })
  unitPrice?: GuaranteeAdminAdditionalPackageUnitPriceResponseDto;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class GuaranteeAdminAdditionalPackageListResponseDto {
  @ApiProperty({
    type: [GuaranteeAdminAdditionalPackageResponseDto],
    description: 'List of additional packages',
  })
  result: GuaranteeAdminAdditionalPackageResponseDto[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}

export class GuaranteeAdminAdditionalPackageSingleResponseDto {
  @ApiProperty({
    type: GuaranteeAdminAdditionalPackageWithUnitPriceResponseDto,
    description: 'Additional package',
  })
  result: GuaranteeAdminAdditionalPackageWithUnitPriceResponseDto;
}
