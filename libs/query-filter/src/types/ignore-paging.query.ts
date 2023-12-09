import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class IgnorePagingFilter {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    type: IsBoolean,
    description: 'ignore paging',
  })
  ignorePaging?: boolean;
}
