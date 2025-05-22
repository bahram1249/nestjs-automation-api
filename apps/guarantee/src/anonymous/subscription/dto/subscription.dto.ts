import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsString, Matches } from 'class-validator';

export class SubscriptionDto {
  @AutoMap()
  @IsString()
  @Matches(new RegExp('^([0-9]){4}([0-9]){7,8}$'), {
    message: 'شماره موبایل صحیح نیست',
  })
  @ApiProperty({
    required: true,
    type: IsString,
    description: 'phoneNumber',
  })
  phoneNumber: string;
}
