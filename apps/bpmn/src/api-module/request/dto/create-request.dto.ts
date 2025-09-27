import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  processId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
