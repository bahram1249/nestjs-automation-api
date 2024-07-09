import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class TotalOrderFilterDto {
  @IsOptional()
  @ApiProperty({ required: false, type: IsString, default: '' })
  @Transform(({ value }) => '%' + value + '%')
  public phoneNumber?: string = '%%';

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    type: IsNumber,
    description: 'orderId',
  })
  orderId?: bigint;
}
