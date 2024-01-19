import { replaceCharacterSlug } from '@rahino/commontools';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class BrandDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @Transform(({ value }) => replaceCharacterSlug(value))
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  slug: string;
}
