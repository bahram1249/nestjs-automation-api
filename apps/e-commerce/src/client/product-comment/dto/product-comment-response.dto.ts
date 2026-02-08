import { ApiProperty } from '@nestjs/swagger';
import { ProductCommentStatusResponseDto } from './product-comment-status-response.dto';
import { ProductCommentFactorResponseDto } from './product-comment-factor-response.dto';
import { ProductCommentReplyResponseDto } from './product-comment-reply-response.dto';

export class ProductCommentUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;
}

export class ProductCommentResponseDto {
  @ApiProperty({ example: 1, description: 'Comment ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  entityId: bigint;

  @ApiProperty({ example: 1, description: 'Status ID' })
  statusId: number;

  @ApiProperty({
    example: 'Great product!',
    description: 'Comment description',
  })
  description: string;

  @ApiProperty({ type: Date, description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({
    type: [ProductCommentReplyResponseDto],
    description: 'Reply comments',
    required: false,
  })
  replies?: ProductCommentReplyResponseDto[];

  @ApiProperty({
    type: ProductCommentStatusResponseDto,
    description: 'Status details',
    required: false,
  })
  status?: ProductCommentStatusResponseDto;

  @ApiProperty({
    type: [ProductCommentFactorResponseDto],
    description: 'Comment factors/ratings',
    required: false,
  })
  commentFactors?: ProductCommentFactorResponseDto[];

  @ApiProperty({
    type: ProductCommentUserResponseDto,
    description: 'User who made the comment',
    required: false,
  })
  user?: ProductCommentUserResponseDto;
}
