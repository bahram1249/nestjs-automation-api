import { ApiProperty } from '@nestjs/swagger';
import { InventoryStatusResponseDto } from './inventory-status-response.dto';
import { VendorResponseDto } from './vendor-response.dto';
import { ColorResponseDto } from './color-response.dto';
import { GuaranteeResponseDto } from './guarantee-response.dto';
import { GuaranteeMonthResponseDto } from './guarantee-month-response.dto';
import { ProvinceResponseDto } from './province-response.dto';
import { ScheduleSendingTypeResponseDto } from './schedule-sending-type-response.dto';
import { InventoryPriceResponseDto } from './inventory-price-response.dto';

export class InventoryResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Color ID', required: false })
  colorId?: number;

  @ApiProperty({ example: 1, description: 'Guarantee ID', required: false })
  guaranteeId?: number;

  @ApiProperty({
    example: 1,
    description: 'Guarantee month ID',
    required: false,
  })
  guaranteeMonthId?: number;

  @ApiProperty({ example: 10, description: 'Quantity' })
  qty: number;

  @ApiProperty({ example: 1, description: 'Only province ID', required: false })
  onlyProvinceId?: number;

  @ApiProperty({ example: 1.5, description: 'Weight', required: false })
  weight?: number;

  @ApiProperty({ example: 1, description: 'Inventory status ID' })
  inventoryStatusId: number;

  @ApiProperty({ example: 1, description: 'Discount type ID', required: false })
  discountTypeId?: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Discount start date',
    required: false,
  })
  discountStartDate?: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: 'Discount end date',
    required: false,
  })
  discountEndDate?: Date;

  @ApiProperty({
    example: 'descriptor',
    description: 'Inventory descriptor',
    required: false,
  })
  inventoryDescriptor?: string;

  @ApiProperty({ example: 1, description: 'Offset day', required: false })
  offsetDay?: number;

  @ApiProperty({
    example: 1,
    description: 'Schedule sending type ID',
    required: false,
  })
  scheduleSendingTypeId?: number;

  @ApiProperty({
    type: () => InventoryStatusResponseDto,
    description: 'Inventory status details',
    required: false,
  })
  inventoryStatus?: InventoryStatusResponseDto;

  @ApiProperty({
    type: () => VendorResponseDto,
    description: 'Vendor details',
    required: false,
  })
  vendor?: VendorResponseDto;

  @ApiProperty({
    type: () => ColorResponseDto,
    description: 'Color details',
    required: false,
  })
  color?: ColorResponseDto;

  @ApiProperty({
    type: () => GuaranteeResponseDto,
    description: 'Guarantee details',
    required: false,
  })
  guarantee?: GuaranteeResponseDto;

  @ApiProperty({
    type: () => GuaranteeMonthResponseDto,
    description: 'Guarantee month details',
    required: false,
  })
  guaranteeMonth?: GuaranteeMonthResponseDto;

  @ApiProperty({
    type: () => ProvinceResponseDto,
    description: 'Only province details',
    required: false,
  })
  onlyProvince?: ProvinceResponseDto;

  @ApiProperty({
    type: () => ScheduleSendingTypeResponseDto,
    description: 'Schedule sending type details',
    required: false,
  })
  scheduleSendingType?: ScheduleSendingTypeResponseDto;

  @ApiProperty({
    type: () => InventoryPriceResponseDto,
    description: 'First price details',
    required: false,
  })
  firstPrice?: InventoryPriceResponseDto;

  @ApiProperty({
    type: () => InventoryPriceResponseDto,
    description: 'Secondary price details',
    required: false,
  })
  secondaryPrice?: InventoryPriceResponseDto;
}
