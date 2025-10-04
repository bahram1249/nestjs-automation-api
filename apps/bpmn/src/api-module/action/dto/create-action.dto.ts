import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActionDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  actionTypeId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionText?: string;
}
