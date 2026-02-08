import { ApiProperty } from '@nestjs/swagger';

export class ProductCommentStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Comment status ID' })
  id: number;

  @ApiProperty({ example: 'Confirmed', description: 'Status name' })
  name: string;
}
