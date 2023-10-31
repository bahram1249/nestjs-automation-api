import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PermissionGroupFilter {
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: IsBoolean,
    description: 'ignore paging',
  })
  ignorePaging?: boolean;
}
