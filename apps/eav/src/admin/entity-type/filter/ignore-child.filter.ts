import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class IgnoreChildFilter {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'parentEntityTypeId',
  })
  public ignoreChilds?: boolean = false;
}
