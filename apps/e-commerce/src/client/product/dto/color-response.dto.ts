import { ApiProperty } from '@nestjs/swagger';

export class ColorResponseDto {
  @ApiProperty({ example: 1, description: 'Color ID' })
  id: number;

  @ApiProperty({ example: 'Red', description: 'Color name' })
  name: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Color hex code',
    required: false,
  })
  hexCode?: string;
}
