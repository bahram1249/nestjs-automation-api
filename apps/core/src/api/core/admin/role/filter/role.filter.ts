import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class RoleFilter {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiProperty({
    required: false,
    default: false,
    type: IsBoolean,
    description: 'ignore paging',
  })
  ignorePaging?: boolean;
}
