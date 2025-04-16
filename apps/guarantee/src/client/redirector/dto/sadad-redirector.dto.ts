import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SadadRedirectorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'token',
  })
  token: string;
}
