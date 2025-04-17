import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class GetFactorDetailDto {
  @AutoMap()
  @IsDateString()
  @IsOptional()
  greaterThan?: Date;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  lessThan?: Date;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    type: IsNumber,
    description: 'factorId',
  })
  factorId?: bigint;
}
