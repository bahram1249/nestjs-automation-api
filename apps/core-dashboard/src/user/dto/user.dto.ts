import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UserDto {
  @IsString()
  firstname: string;
  @IsString()
  lastname: string;

  @IsString()
  @Matches(new RegExp('^([0-9]){4}([0-9]){7,8}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    description: 'phoneNumber',
  })
  phoneNumber: string;
}
