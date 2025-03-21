import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class GetCartableFilteDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    type: IsNumber,
    description: 'requestId',
  })
  requestId?: bigint;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    type: IsNumber,
    description: 'requestStateId',
  })
  requestStateId?: bigint;
}
