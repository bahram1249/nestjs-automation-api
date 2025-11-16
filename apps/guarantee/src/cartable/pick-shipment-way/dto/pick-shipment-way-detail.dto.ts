import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RequestItemDto } from './request-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PickShipmentWayDetailDto {
  @IsNumber()
  cartableShipmentWayId: number;

  @IsOptional()
  @IsString()
  cartableShipmentWayTrackingCode?: string;

  @IsOptional()
  @IsArray()
  items?: RequestItemDto[];
}
