import { ApiProperty } from '@nestjs/swagger';
import { HomePageTypeEnum } from '../../../shared/enum';

export class HomeSliderItemDto {
  @ApiProperty({ description: 'Link URL' })
  link: string;

  @ApiProperty({ description: 'Alt text', required: false })
  alt?: string;

  @ApiProperty({ description: 'Image URL' })
  imageUrl: string;

  @ApiProperty({ description: 'Mobile image URL' })
  mobileImageUrl: string;
}

export class HomeBannerItemDto {
  @ApiProperty({ description: 'Link URL' })
  link: string;

  @ApiProperty({ description: 'Alt text', required: false })
  alt?: string;

  @ApiProperty({ description: 'Image URL' })
  imageUrl: string;
}

export class HomeSectionDto {
  @ApiProperty({ example: 1, description: 'Section priority' })
  priority: number;

  @ApiProperty({
    example: 'banner',
    description: 'Section type',
    enum: HomePageTypeEnum,
  })
  type: HomePageTypeEnum;

  @ApiProperty({ description: 'Section title', required: false })
  title?: string;

  @ApiProperty({ description: 'API link', required: false })
  link?: string;

  @ApiProperty({ description: 'Frontend total link', required: false })
  totalLink?: string | null;

  @ApiProperty({
    description: 'Whether section requires request-based loading',
  })
  requestBased: boolean;

  @ApiProperty({
    type: HomeSliderItemDto,
    isArray: true,
    description: 'Slider items (for slider type)',
    required: false,
  })
  items?: HomeSliderItemDto[] | HomeBannerItemDto[];
}

export class HomeResponseDto {
  @ApiProperty({
    type: HomeSectionDto,
    isArray: true,
    description: 'Home sections',
  })
  sections: HomeSectionDto[];
}
