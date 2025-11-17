import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @ApiProperty({ type: String, maxLength: 256 })
  @AutoMap()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  @ApiProperty({ type: String, maxLength: 256, required: false })
  @AutoMap()
  barcode?: string;
}
