import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class OnlyParentDto {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    type: IsBoolean,
    description: 'only parent',
  })
  onlyParent?: boolean;
}
