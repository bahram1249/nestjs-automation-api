import { ApiProperty } from '@nestjs/swagger';
import { ProductCommentStatusResponseDto } from './product-comment-status-response.dto';
import { ProductCommentProductResponseDto } from './product-comment-product-response.dto';
import { ProductCommentUserResponseDto } from './product-comment-user-response.dto';
import { ProductCommentFactorResponseDto } from './product-comment-factor-response.dto';

export class ProductCommentResponseDto {
  @ApiProperty({ example: 1, description: 'Comment ID' })
  id: bigint;

  @ApiProperty({
    example: 'This is a great product!',
    description: 'Comment description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Status ID', required: false })
  statusId?: number;

  @ApiProperty({ example: 1, description: 'User ID', required: false })
  userId?: bigint;

  @ApiProperty({ example: 1, description: 'Reply ID', required: false })
  replyId?: bigint;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Update timestamp',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => ProductCommentStatusResponseDto,
    description: 'Comment status details',
    required: false,
  })
  status?: ProductCommentStatusResponseDto;

  @ApiProperty({
    type: () => ProductCommentProductResponseDto,
    description: 'Product details',
    required: false,
  })
  product?: ProductCommentProductResponseDto;

  @ApiProperty({
    type: () => ProductCommentUserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: ProductCommentUserResponseDto;

  @ApiProperty({
    type: () => ProductCommentResponseDto,
    description: 'Reply comment details',
    required: false,
  })
  reply?: ProductCommentResponseDto;

  @ApiProperty({
    type: () => [ProductCommentFactorResponseDto],
    description: 'Comment factors',
    required: false,
  })
  commentFactors?: ProductCommentFactorResponseDto[];
}
