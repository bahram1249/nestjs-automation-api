import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 'Official Guarantee', description: 'Guarantee name' })
  name: string;

  @ApiProperty({
    example: 'guarantee-slug',
    description: 'Guarantee slug',
    required: false,
  })
  slug?: string;
}
