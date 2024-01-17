import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class BrandDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  slug: string;
}
