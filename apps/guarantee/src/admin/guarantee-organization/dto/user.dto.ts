import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UserDto {
  @AutoMap()
  @IsString()
  firstname: string;
  @AutoMap()
  @IsString()
  lastname: string;
  @AutoMap()
  @IsString()
  phoneNumber: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  @Matches(new RegExp('^([0-9]){10}$'), {
    message: 'کد ملی باید 10 رقم باشد',
  })
  @ApiProperty({
    required: false,
    type: IsString,
    default: 'nationalCode',
    description: 'nationalCode',
  })
  nationalCode?: string;
}
