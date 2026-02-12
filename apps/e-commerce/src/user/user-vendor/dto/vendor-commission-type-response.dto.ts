import { ApiProperty } from '@nestjs/swagger';

export class VendorCommissionTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Commission Type ID' })
  id: number;

  @ApiProperty({ example: 'Percentage', description: 'Commission type name' })
  name: string;
}
