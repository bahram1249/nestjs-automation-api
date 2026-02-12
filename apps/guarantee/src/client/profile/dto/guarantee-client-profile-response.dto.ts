import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientProfileResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'National code',
    required: false,
  })
  nationalCode?: string;
}

export class GuaranteeClientProfileUpdateResponseDto {
  @ApiProperty({ type: Object, description: 'Response message' })
  result: {
    message: string;
  };
}
