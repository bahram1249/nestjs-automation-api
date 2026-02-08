import { ApiProperty } from '@nestjs/swagger';

export class HeaderNotificationResponseDto {
  @ApiProperty({
    example: 'Welcome to our store!',
    description: 'Notification message',
    required: false,
  })
  message?: string;

  @ApiProperty({
    example: '#FFFFFF',
    description: 'Text color',
    required: false,
  })
  textColor?: string;

  @ApiProperty({
    example: '#000000',
    description: 'Background color',
    required: false,
  })
  backgroundColor?: string;
}
