import { ApiProperty } from '@nestjs/swagger';
import {
  ReportInventoryStatusResponseDto,
  ReportProductResponseDto,
  ReportColorResponseDto,
  ReportGuaranteeResponseDto,
} from '../../dto/report-shared-response.dto';

export class InventoryReportResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Color ID', required: false })
  colorId?: number;

  @ApiProperty({ example: 1, description: 'Guarantee ID', required: false })
  guaranteeId?: number;

  @ApiProperty({ example: 1, description: 'Inventory status ID' })
  inventoryStatusId: number;

  @ApiProperty({ example: 100, description: 'Quantity' })
  qty: number;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Inventory status details',
    type: () => ReportInventoryStatusResponseDto,
    required: false,
  })
  inventoryStatus?: ReportInventoryStatusResponseDto;

  @ApiProperty({
    description: 'Product details',
    type: () => ReportProductResponseDto,
    required: false,
  })
  product?: ReportProductResponseDto;

  @ApiProperty({
    description: 'Color details',
    type: () => ReportColorResponseDto,
    required: false,
  })
  color?: ReportColorResponseDto;

  @ApiProperty({
    description: 'Guarantee details',
    type: () => ReportGuaranteeResponseDto,
    required: false,
  })
  guarantee?: ReportGuaranteeResponseDto;
}
