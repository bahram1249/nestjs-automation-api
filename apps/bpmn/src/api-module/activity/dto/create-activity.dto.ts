import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isStartActivity: boolean;

  @ApiProperty()
  @IsBoolean()
  isEndActivity: boolean;

  @ApiProperty()
  @IsInt()
  activityTypeId: number;

  @ApiProperty()
  @IsInt()
  processId: number;

  @ApiProperty()
  @IsBoolean()
  haveMultipleItems: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  insideProcessRunnerId?: number;
}
