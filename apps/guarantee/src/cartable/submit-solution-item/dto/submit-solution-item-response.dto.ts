import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableSuccessMessageResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      message: { type: 'string', example: 'success' },
    },
    description: 'Success message',
  })
  result: {
    message: string;
  };
}
