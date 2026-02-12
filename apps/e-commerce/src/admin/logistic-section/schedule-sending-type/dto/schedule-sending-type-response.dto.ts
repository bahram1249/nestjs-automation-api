import { ApiProperty } from '@nestjs/swagger';

export class ScheduleSendingTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Schedule Sending Type ID' })
  id: number;

  @ApiProperty({ example: 'Weekly', description: 'Title' })
  title: string;

  @ApiProperty({ example: 'icon.png', description: 'Icon', required: false })
  icon?: string;
}
