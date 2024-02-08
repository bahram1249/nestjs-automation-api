import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VendorUserDto } from './vendor-user.dto';
import { replaceCharacterSlug } from '@rahino/commontools';
import { Transform } from 'class-transformer';

export class VendorDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @Transform(({ value }) => replaceCharacterSlug(value))
  @AutoMap()
  slug: string;

  @MinLength(3)
  @MaxLength(512)
  @IsOptional()
  @AutoMap()
  address?: string;

  @AutoMap()
  @IsOptional()
  description?: string;

  @AutoMap()
  @IsNumber()
  priorityOrder?: number;

  user: VendorUserDto;
}