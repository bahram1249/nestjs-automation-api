import { ApiProperty } from '@nestjs/swagger';

export class FindUserResponseDto {
  @ApiProperty({
    example: 'can be reserved',
    description: 'Message indicating if username can be reserved',
  })
  result: string;
}
