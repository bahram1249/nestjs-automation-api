import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SuperVisorUserDto {
  @AutoMap()
  @IsString()
  public firstname: string;

  @AutoMap()
  @IsString()
  public lastname: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^([0-9]){4}([0-9]){7,8}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'phoneNumber',
  })
  public phoneNumber: string;
}
