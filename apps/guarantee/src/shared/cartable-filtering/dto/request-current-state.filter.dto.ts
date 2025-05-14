import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class RequestCurrentStateFilterDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'requestId',
  })
  requestId?: bigint;
}
