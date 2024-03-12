import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AllFactorReportDto {
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @ApiProperty({
    required: true,
    default: 10,
    description: 'how many item returned.',
    type: IsNumber,
  })
  public buffetId: bigint;
}
