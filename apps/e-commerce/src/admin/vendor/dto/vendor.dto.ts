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
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: String,
    description: 'logisticId',
  })
  public logisticId?: bigint;
}
