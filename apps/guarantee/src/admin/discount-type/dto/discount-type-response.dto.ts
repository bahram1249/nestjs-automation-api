import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminDiscountTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Type ID' })
  id: number;

  @ApiProperty({ example: 'Percentage', description: 'Discount type title' })
  title: string;
}

export class GuaranteeAdminDiscountTypeListResponseDto {
  @ApiProperty({
    type: [GuaranteeAdminDiscountTypeResponseDto],
    description: 'List of discount types',
  })
  result: GuaranteeAdminDiscountTypeResponseDto[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}

export class GuaranteeAdminDiscountTypeSingleResponseDto {
  @ApiProperty({
    type: GuaranteeAdminDiscountTypeResponseDto,
    description: 'Discount type',
  })
  result: GuaranteeAdminDiscountTypeResponseDto;
}
