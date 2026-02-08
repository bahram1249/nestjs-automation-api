import { ApiProperty } from '@nestjs/swagger';

export class ValidAreaResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the location is within the valid area of the vendor',
  })
  inValidArea: boolean;
}
