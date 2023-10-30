import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PermissionFilter {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'by role id',
  })
  roleId?: number;
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
