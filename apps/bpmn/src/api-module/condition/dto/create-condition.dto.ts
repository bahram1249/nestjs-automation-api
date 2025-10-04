import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConditionDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  conditionTypeId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionText?: string;
}
