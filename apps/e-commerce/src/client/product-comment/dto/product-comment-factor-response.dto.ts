import { ApiProperty } from '@nestjs/swagger';
import { EntityTypeFactorResponseDto } from './entity-type-factor-response.dto';

export class ProductCommentFactorResponseDto {
  @ApiProperty({ example: 1, description: 'Comment factor ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Comment ID' })
  commentId: bigint;

  @ApiProperty({ example: 1, description: 'Factor ID' })
  factorId: number;

  @ApiProperty({ example: 5, description: 'Score given' })
  score: number;

  @ApiProperty({
    type: EntityTypeFactorResponseDto,
    description: 'Factor details',
    required: false,
  })
  factor?: EntityTypeFactorResponseDto;
}
