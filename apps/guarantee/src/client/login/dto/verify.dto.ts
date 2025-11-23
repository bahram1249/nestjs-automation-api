import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

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
  @Matches(new RegExp('^([0-9])*$'), {
    message: 'کد ملی باید 10 رقم باشد',
  })
  @ApiProperty({
    required: false,
    type: IsString,
    default: 'nationalCode',
    description: 'nationalCode',
  })
  nationalCode?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^([0-9]){4}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'code',
  })
  code: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: IsNumber,
    default: '1',
    description: 'userTypeId',
  })
  userTypeId?: number;
}
