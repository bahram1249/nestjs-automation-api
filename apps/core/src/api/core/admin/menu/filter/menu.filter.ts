import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class MenuFilter {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiProperty({
    required: false,
    default: false,
    type: IsBoolean,
    description: 'only show parent menus',
  })
  onlyParent?: boolean;
}
