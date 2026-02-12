import { ApiProperty } from '@nestjs/swagger';

export class ProductCommentStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Product Comment Status ID' })
  id: number;

  @ApiProperty({ example: 'Pending', description: 'Status Name' })
  name: string;
}
