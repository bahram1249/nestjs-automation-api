import { ApiProperty } from '@nestjs/swagger';

export class ScheduleSendingTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Schedule sending type ID' })
  id: number;

  @ApiProperty({
    example: 'Express',
    description: 'Schedule sending type title',
  })
  title: string;

  @ApiProperty({
    example: 'icon-name',
    description: 'Icon name',
    required: false,
  })
  icon?: string;
}
