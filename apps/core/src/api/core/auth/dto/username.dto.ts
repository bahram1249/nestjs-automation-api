import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UsernameDto {
  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^([A-Za-z0-9_.]|-){3,20}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'username',
  })
  username: string;
}
