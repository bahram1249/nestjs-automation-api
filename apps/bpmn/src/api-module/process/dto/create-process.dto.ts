import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProcessDto {
  @ApiProperty({ description: 'Process name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Is a subprocess' })
  @IsOptional()
  @IsBoolean()
  isSubProcess?: boolean;

  @ApiPropertyOptional({
    description: 'Static identifier to map well-known processes',
  })
  @IsOptional()
  @IsInt()
  staticId?: number;
}
