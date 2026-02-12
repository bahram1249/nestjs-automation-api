import { ApiProperty } from '@nestjs/swagger';

export class VideoUploadResponseDto {
  @ApiProperty({ example: 1, description: 'Video attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'uuid.mp4', description: 'File name' })
  fileName: string;
}
