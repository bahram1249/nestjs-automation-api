import {
  OrderShipmentwayEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LogisticStockPaymentDto {
  // Selected variation price context and payment gateway
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  variationPriceId!: bigint;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  paymentId!: bigint;

  // Address and optional note
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  addressId!: bigint;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noteDescription?: string;

  // Optional coupon
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;

  // Groups selected by FE (must cover all session stocks)
  @ApiProperty({ type: () => [LogisticShipmentSelectionGroupInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogisticShipmentSelectionGroupInput)
  groups!: LogisticShipmentSelectionGroupInput[];
}

export interface LogisticPaymentRequestResult {
  redirectUrl: string;
}

// Minimal group payload expected from client for logistics payment
export class LogisticShipmentSelectionGroupInput {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  logisticId!: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  shipmentWayId!: number;

  @ApiProperty({ enum: OrderShipmentwayEnum })
  @IsNotEmpty()
  @IsEnum(OrderShipmentwayEnum)
  shipmentWayType!: OrderShipmentwayEnum;

  // optional schedule/weekly periods
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sendingPeriodId?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weeklyPeriodId?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weeklyPeriodTimeId?: number | null;

  // Optional explicit sending date; must match logistic-period availability if provided
  @ApiPropertyOptional({
    description: 'Gregorian date (YYYY-MM-DD) or ISO string',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  sendingDate?: string | null;

  // minimal stock identifiers only
  @ApiProperty({ type: () => [Number] })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  stockIds!: Array<number>;
}
