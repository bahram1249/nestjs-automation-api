import { ApiProperty } from '@nestjs/swagger';

export class PublicPhotoResponseDto {
  @ApiProperty({ example: true, description: 'Success status' })
  ok: boolean;
}

export class PublicPhotoUrlResponseDto {
  @ApiProperty({
    example: 'https://minio.example.com/bucket/file.jpg',
    description: 'Photo access URL',
  })
  result: string;
}
