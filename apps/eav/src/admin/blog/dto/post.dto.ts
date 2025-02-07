import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class PostDto {
  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'title',
  })
  public title: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'slug',
  })
  public slug: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'description',
  })
  public description?: string;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'entityTypeId',
  })
  public entityTypeId?: number;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'publishId',
  })
  public publishId: number;

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'metaTitle',
  })
  public metaTitle?: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'metaDescription',
  })
  public metaDescription?: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'metaKeywords',
  })
  public metaKeywords?: string;
}
