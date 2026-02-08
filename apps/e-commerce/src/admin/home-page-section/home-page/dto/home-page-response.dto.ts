import { ApiProperty } from '@nestjs/swagger';
import { HomePageTypeEnum } from '@rahino/ecommerce/shared/enum';
import { ContentDtoType } from './content';

export class HomePageDataItemDto {
  @ApiProperty({ description: 'Unique identifier', required: false })
  id?: string;

  @ApiProperty({ description: 'Name of the home page section' })
  name: string;

  @ApiProperty({ description: 'Priority order', type: Number })
  priority: number;

  @ApiProperty({
    description: 'Type of home page section',
    enum: HomePageTypeEnum,
  })
  type: HomePageTypeEnum;

  @ApiProperty({
    description: 'Content data (varies by type)',
    type: Object,
  })
  content: ContentDtoType;
}

export class HomePageResponseDto {
  @ApiProperty({
    description: 'Home page content (parsed from jsonContent)',
    required: false,
    type: HomePageDataItemDto,
  })
  data?: HomePageDataItemDto;
}
