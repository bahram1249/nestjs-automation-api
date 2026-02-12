import { ApiProperty } from '@nestjs/swagger';

export class HomePhotoResponseDto {
  @ApiProperty({ example: 'ok', description: 'Result status' })
  result: string;
}
