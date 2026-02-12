import { ApiProperty } from '@nestjs/swagger';

export class DiscountResponseDto {
  @ApiProperty({ example: 1, description: 'Discount ID' })
  id: bigint;

  @ApiProperty({ example: 'Discount Name', description: 'Discount name' })
  name: string;
}
