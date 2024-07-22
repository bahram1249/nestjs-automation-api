import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import {
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { HomePageTypeEnum } from '../../../util/enum/home-page-type.enum';
import { ContentDtoType } from './content';
import { isValidContent } from '../decorator';

export class HomePageDataDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  public name: string;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'priority',
  })
  public priority: number;

  @IsEnum(HomePageTypeEnum)
  @IsNotEmpty()
  @AutoMap()
  public type: HomePageTypeEnum;

  @IsNotEmpty()
  @isValidContent({ each: true })
  public content: ContentDtoType;
}
