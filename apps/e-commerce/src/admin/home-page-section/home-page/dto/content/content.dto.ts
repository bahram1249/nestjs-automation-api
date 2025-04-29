import { AmazingContentDto } from './amazing-content.dto';
import { BannerContentDto } from './banner-content.dto';
import { BrandContentDto } from './brand-content.dto';
import { CategoryContentDto } from './category-content.dto';
import { ProductCategoryContentDto } from './product-category-content.dto';
import { ProductContentDto } from './product-content.dto';
import { SelectedProductContentDto } from './selected-product-content.dto';
import { SliderContentDto } from './slider-content.dto';

export type ContentDtoType =
  | SliderContentDto[]
  | BannerContentDto[]
  | ProductCategoryContentDto
  | CategoryContentDto
  | BrandContentDto
  | AmazingContentDto
  | ProductContentDto
  | SelectedProductContentDto;
