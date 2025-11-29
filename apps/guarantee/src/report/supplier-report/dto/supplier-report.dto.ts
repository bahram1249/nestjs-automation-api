import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SupplierReportDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'search by name, username, phone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'organization id',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  organizationId?: number;
}
