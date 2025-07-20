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
import { ContentDtoType } from './content';
import { isValidContent } from '../decorator';
import { HomePageTypeEnum } from '@rahino/ecommerce/shared/enum';

export class HomePageDataDto {
  @IsNotEmpty()
  @AutoMap()
  public id?: string;

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
