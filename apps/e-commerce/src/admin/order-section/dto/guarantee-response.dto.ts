import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 'Company Guarantee', description: 'Guarantee name' })
  name: string;

  @ApiProperty({ example: 'company-guarantee', description: 'Guarantee slug' })
  slug: string;
}
