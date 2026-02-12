import { ApiProperty } from '@nestjs/swagger';

export class GSFactorTransactionOutputDto {
  @ApiProperty({ example: 1, description: 'Transaction ID' })
  public id: bigint;

  @ApiProperty({
    example: 'Bank Gateway',
    description: 'Payment gateway title',
  })
  public gatewayTitle: string;

  @ApiProperty({ example: 100000, description: 'Transaction price' })
  public price: bigint;
}
