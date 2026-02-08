import { ApiProperty } from '@nestjs/swagger';

export class CommentStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Comment status ID' })
  id: number;

  @ApiProperty({ example: 'Confirmed', description: 'Comment status name' })
  name: string;
}

export class CommentProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({
    example: 'SKU-001',
    description: 'Product SKU',
    required: false,
  })
  sku?: string;

  @ApiProperty({ example: 'product-slug', description: 'Product slug' })
  slug: string;
}

export class CommentUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;
}

export class CommentFactorResponseDto {
  @ApiProperty({ example: 1, description: 'Comment factor ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Comment ID' })
  commentId: bigint;

  @ApiProperty({ example: 1, description: 'Entity ID' })
  entityId: bigint;

  @ApiProperty({ example: 1, description: 'Factor ID' })
  factorId: number;

  @ApiProperty({ example: 5, description: 'Score' })
  score: number;

  @ApiProperty({
    type: () => Object,
    description: 'Factor details',
    required: false,
  })
  factor?: any;
}

export class CommentResponseDto {
  @ApiProperty({ example: 1, description: 'Comment ID' })
  id: bigint;

  @ApiProperty({
    example: 'Great product!',
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
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => CommentStatusResponseDto,
    description: 'Comment status details',
    required: false,
  })
  status?: CommentStatusResponseDto;

  @ApiProperty({
    type: () => CommentProductResponseDto,
    description: 'Product details',
    required: false,
  })
  product?: CommentProductResponseDto;

  @ApiProperty({
    type: () => CommentUserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: CommentUserResponseDto;

  @ApiProperty({
    type: () => [CommentFactorResponseDto],
    description: 'Comment factors',
    required: false,
  })
  commentFactors?: CommentFactorResponseDto[];
}
