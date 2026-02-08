import { ApiProperty } from '@nestjs/swagger';

export class KeyValueResponseDto {
  @ApiProperty({ example: 1, description: 'Key' })
  key: number;

  @ApiProperty({ example: 'Value', description: 'Value' })
  value: string;
}
