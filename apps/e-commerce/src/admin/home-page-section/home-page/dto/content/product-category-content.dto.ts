import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ProductCategoryContentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @AutoMap()
  public title: string;

  @IsNumber()
  @AutoMap()
  public entityTypeId: number;

  @IsNumber()
  @AutoMap()
  public sortBy: number;
}
