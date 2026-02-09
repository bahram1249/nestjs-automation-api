import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientOnlinePaymentGatewayDto {
  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  id: number;

  @ApiProperty({
    example: 'Gateway Title',
    description: 'Payment gateway title',
  })
  title: string;

  @ApiProperty({
    example: 'icon.png',
    description: 'Gateway icon',
    required: false,
  })
  icon?: string;
}

export class GuaranteeClientOnlinePaymentGatewayListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientOnlinePaymentGatewayDto],
    description: 'List of payment gateways',
  })
  result: GuaranteeClientOnlinePaymentGatewayDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
