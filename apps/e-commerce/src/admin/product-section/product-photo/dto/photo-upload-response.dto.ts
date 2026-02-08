import { ApiProperty } from '@nestjs/swagger';

export class PhotoUploadResponseDto {
  @ApiProperty({ example: 1, description: 'Photo attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'uuid.jpg', description: 'File name' })
  fileName: string;
}
