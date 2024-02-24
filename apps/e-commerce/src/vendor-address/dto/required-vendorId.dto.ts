import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RequiredVendorIdDto {
  @IsNumber()
  @ApiProperty({
    minimum: 1,
    required: false,
    type: IsNumber,
    description: 'vendorId',
  })
  vendorId: number;
}
