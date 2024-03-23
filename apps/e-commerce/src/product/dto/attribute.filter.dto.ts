import { IsArray, IsOptional } from 'class-validator';
import { AttributeDto } from './attribute.dto';
import { Transform } from 'class-transformer';
import { parseValue } from '@rahino/commontools/functions/parse-value';
import { ApiProperty } from '@nestjs/swagger';

export class AttributeFilterDto {
  @ApiProperty({
    name: 'attributes',
    required: false,
    type: [AttributeDto],
    description: 'attributes',
  })
  @IsOptional()
  @IsArray()
  @Transform((item) =>
    typeof item.value.map === 'function'
      ? item.value.map((v) => parseValue(v))
      : [parseValue(item.value)],
  )
  attributes?: AttributeDto[] = [];
}
