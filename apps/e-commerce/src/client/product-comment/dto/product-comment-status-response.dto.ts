import { ApiProperty } from '@nestjs/swagger';

export class ProductCommentStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Status ID' })
  id: number;

  @ApiProperty({ example: 'Confirmed', description: 'Status name' })
  name: string;
}
