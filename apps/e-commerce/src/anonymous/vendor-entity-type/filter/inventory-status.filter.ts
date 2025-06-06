import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class InventoryStatusFilter {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    default: 1,
    type: Number,
    description: 'inventoryStatusId',
  })
  public inventoryStatusId?: number;
}
