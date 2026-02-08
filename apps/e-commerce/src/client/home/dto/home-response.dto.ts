import { ApiProperty } from '@nestjs/swagger';

export class HomeSectionDto {
  @ApiProperty({ example: 'banner', description: 'Section type' })
  type: string;

  @ApiProperty({ description: 'Section data (varies by type)' })
  data: any;
}

export class HomeResponseDto {
  @ApiProperty({
    type: HomeSectionDto,
    isArray: true,
    description: 'Home sections',
  })
  sections: HomeSectionDto[];
}
