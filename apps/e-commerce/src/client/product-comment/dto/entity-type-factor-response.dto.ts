import { ApiProperty } from '@nestjs/swagger';

export class EntityTypeFactorResponseDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: number;

  @ApiProperty({ example: 'Quality', description: 'Factor name' })
  name: string;
}
