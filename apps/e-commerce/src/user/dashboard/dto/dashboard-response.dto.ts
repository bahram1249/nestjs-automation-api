import { ApiProperty } from '@nestjs/swagger';

export class DashboardTotalOrdersResponseDto {
  @ApiProperty({ example: 10, description: 'Total number of orders' })
  result: number;
}

export class DashboardTotalCommentsResponseDto {
  @ApiProperty({ example: 5, description: 'Total number of comments' })
  result: number;
}

export class DashboardTotalWalletAmountsResponseDto {
  @ApiProperty({ example: 100000, description: 'Total wallet amount' })
  result: bigint;
}
