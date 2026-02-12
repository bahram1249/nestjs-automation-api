import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminCartableListResponseDto {
  @ApiProperty({ description: 'List of cartable items' })
  result: any[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}
