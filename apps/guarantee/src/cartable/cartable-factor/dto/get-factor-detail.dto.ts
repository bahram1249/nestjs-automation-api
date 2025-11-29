import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'requestId',
  })
  requestId?: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString,
    description: 'nationalCode',
  })
  nationalCode?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString,
    description: 'phoneNumber',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString,
    description: 'firstname',
  })
  firstname?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString,
    description: 'lastname',
  })
  lastname?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'requestTypeId',
  })
  requestTypeId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString,
    description: 'serialNumber',
  })
  serialNumber?: string;
}
