import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class ColorFilterDto {
  @IsOptional()
  @IsArray()
  @Transform((item) =>
    typeof item.value.map === 'function'
      ? item.value.map((v) => parseInt(v, 10))
      : [parseInt(item.value, 10)],
  )
  @IsInt({ each: true })
  colors?: number[] = [];
}
