import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class IncludeAttributeFilterDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiProperty({
    required: false,
    default: false,
    type: IsBoolean,
    description: 'includeAttribute',
  })
  includeAttribute?: boolean;
}
