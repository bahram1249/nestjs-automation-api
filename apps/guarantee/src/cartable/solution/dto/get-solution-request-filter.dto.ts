import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class GetSolutionRequestFilterDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    default: false,
    type: IsNumber,
    description: 'requestId',
  })
  requestId: number;
}
