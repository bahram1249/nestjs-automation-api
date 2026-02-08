import { ApiProperty } from '@nestjs/swagger';
import { AttachmentResponseDto } from './attachment-response.dto';

export class ProfileResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date',
    required: false,
  })
  birthDate?: Date;

  @ApiProperty({
    type: () => AttachmentResponseDto,
    description: 'Profile attachment',
    required: false,
  })
  profileAttachment?: AttachmentResponseDto;
}
