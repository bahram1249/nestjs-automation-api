import { IsArray, ValidateNested } from 'class-validator';
import { HomePageDataDto } from './home-page-data.dto';
import { Type } from 'class-transformer';

export class HomePageDto {
  //@IsArray()
  @ValidateNested({ each: true })
  @Type(({}) => HomePageDataDto)
  data: HomePageDataDto[];
}
