import { ApiProperty } from '@nestjs/swagger';

export class HeaderNotificationResponseDto {
  @ApiProperty({
    example: 'Welcome to our store!',
    description: 'Notification message',
  })
  message: string;

  @ApiProperty({ example: '#FFFFFF', description: 'Text color' })
  textColor: string;

  @ApiProperty({ example: '#000000', description: 'Background color' })
  backgroundColor: string;
}
