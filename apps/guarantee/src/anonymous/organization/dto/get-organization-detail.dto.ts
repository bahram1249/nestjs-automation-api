import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetOrganizationDetailDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'provinceId',
    type: IsNumber,
  })
  public provinceId?: number;
}
