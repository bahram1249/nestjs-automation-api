import { ApiProperty } from '@nestjs/swagger';

export class EntityModelResponseDto {
  @ApiProperty({ example: 1, description: 'Entity model ID' })
  id: number;

  @ApiProperty({ example: 'Product', description: 'Entity model name' })
  name: string;
}
