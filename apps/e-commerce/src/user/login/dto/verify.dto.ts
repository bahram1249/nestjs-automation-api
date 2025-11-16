import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^([0-9]){4}([0-9]){7,8}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'phoneNumber',
  })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @Matches(new RegExp('^(?!undefined).*$'))
  @ApiProperty({
    required: false,
    type: IsString,
    default: 'string',
    description: 'firstname',
  })
  firstname?: string;

  @IsString()
  @IsOptional()
  @Matches(new RegExp('^(?!undefined).*$'))
  @ApiProperty({
    required: false,
    type: IsString,
    default: 'string',
    description: 'lastname',
  })
  lastname?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsString,
    description: 'nationalCode',
  })
  nationalCode?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^([0-9]){5,6}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'code',
  })
  code: string;
}
