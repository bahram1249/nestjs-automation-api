import { ApiProperty } from '@nestjs/swagger';

export class ProductCommentFactorResponseDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Comment ID' })
  commentId: bigint;

  @ApiProperty({ example: 1, description: 'Entity ID' })
  entityId: bigint;

  @ApiProperty({ example: 1, description: 'Factor ID reference' })
  factorId: number;

  @ApiProperty({ example: 5, description: 'Score value' })
  score: number;
}
