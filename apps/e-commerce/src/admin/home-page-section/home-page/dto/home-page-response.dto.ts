import { ApiProperty } from '@nestjs/swagger';

export class HomePageResponseDto {
  @ApiProperty({
    description: 'Home page content (parsed from jsonContent)',
    required: false,
    type: Object,
  })
  data?: any;

  [key: string]: any;
}
