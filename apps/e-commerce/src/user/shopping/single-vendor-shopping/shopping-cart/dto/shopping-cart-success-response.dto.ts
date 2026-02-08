import { ApiProperty } from '@nestjs/swagger';

export class ShoppingCartSuccessResponseDto {
  @ApiProperty({ example: 'Success', description: 'Success message' })
  result: string;
}
