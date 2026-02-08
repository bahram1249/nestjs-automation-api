import { ApiProperty } from '@nestjs/swagger';

export class PublishStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Publish status ID' })
  id: number;

  @ApiProperty({ example: 'Published', description: 'Publish status name' })
  name: string;
}
