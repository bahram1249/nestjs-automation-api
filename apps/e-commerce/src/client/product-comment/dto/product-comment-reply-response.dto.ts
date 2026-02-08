import { ApiProperty } from '@nestjs/swagger';
import { ProductCommentStatusResponseDto } from './product-comment-status-response.dto';
import { ProductCommentFactorResponseDto } from './product-comment-factor-response.dto';

export class ProductCommentReplyResponseDto {
  @ApiProperty({ example: 1, description: 'Reply ID' })
  id: bigint;

  @ApiProperty({
    example: 'Thank you for your feedback',
    description: 'Reply description',
  })
  description: string;

  @ApiProperty({ example: 1, description: 'Status ID' })
  statusId: number;

  @ApiProperty({ type: Date, description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({
    type: ProductCommentStatusResponseDto,
    description: 'Status details',
    required: false,
  })
  status?: ProductCommentStatusResponseDto;
}
