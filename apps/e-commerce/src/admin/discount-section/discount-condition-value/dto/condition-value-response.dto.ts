import { ApiProperty } from '@nestjs/swagger';
import { KeyValueResponseDto } from './key-value-response.dto';

export class ConditionValueResponseDto {
  @ApiProperty({
    type: () => [KeyValueResponseDto],
    description: 'Array of key-value pairs',
  })
  result: KeyValueResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;

  @ApiProperty({
    example: 'Success',
    description: 'Response message',
    required: false,
  })
  message?: string;
}
