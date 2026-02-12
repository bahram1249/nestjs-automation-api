import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientRequestTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Request Type ID' })
  id: number;

  @ApiProperty({ example: 'Repair', description: 'Request type title' })
  title: string;
}
