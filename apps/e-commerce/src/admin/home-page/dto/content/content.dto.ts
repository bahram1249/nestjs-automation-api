import { BannerContentDto } from './banner-content.dto';
import { ProductCategoryContentDto } from './product-category-content.dto';
import { SliderContentDto } from './slider-content.dto';

export type ContentDtoType =
  | SliderContentDto[]
  | BannerContentDto[]
  | ProductCategoryContentDto;
