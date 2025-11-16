import { AutoMap } from 'automapper-classes';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  isObject,
} from 'class-validator';
import { VendorUserDto } from './vendor-user.dto';
import { replaceCharacterSlug } from '@rahino/commontools';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommissionDto } from './commission.dto';

export class VendorV2Dto {
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
  @IsOptional()
  @Min(1)
  priorityOrder?: number;

  @IsObject()
  user: VendorUserDto;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaTitle',
  })
  public metaTitle?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaKeywords',
  })
  public metaKeywords?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaDescription',
  })
  public metaDescription?: string;

  @IsArray()
  commissions: CommissionDto[];

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'latitude',
  })
  public latitude?: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'longitude',
  })
  public longitude?: string;

  @AutoMap()
  @IsNumber()
  provinceId: number;

  @AutoMap()
  @IsNumber()
  cityId: number;

  @AutoMap()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'isActive',
  })
  isActive?: boolean;
}
