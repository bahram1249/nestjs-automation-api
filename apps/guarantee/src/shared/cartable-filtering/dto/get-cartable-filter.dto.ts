import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCartableFilteDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'requestId',
  })
  requestId?: bigint;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'requestStateId',
  })
  requestStateId?: bigint;

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

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'activityId',
  })
  activityId?: number;

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: [IsNumber],
    description: 'array of requestIds',
  })
  requestIds?: bigint[];
}
