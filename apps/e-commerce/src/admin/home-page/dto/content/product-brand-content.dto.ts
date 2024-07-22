import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ProductBrandContentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @AutoMap()
  public title: string;

  @IsNumber()
  @AutoMap()
  public brandId: number;

  @IsNumber()
  @AutoMap()
  public sortBy: number;
}
