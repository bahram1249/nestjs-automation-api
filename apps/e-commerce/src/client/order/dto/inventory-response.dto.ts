import { ApiProperty } from '@nestjs/swagger';
import { ColorResponseDto } from './color-response.dto';
import { GuaranteeResponseDto } from './guarantee-response.dto';
import { GuaranteeMonthResponseDto } from './guarantee-month-response.dto';

export class InventoryResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory ID' })
  id: bigint;

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
}
