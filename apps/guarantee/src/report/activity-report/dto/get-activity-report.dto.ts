import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsInt } from 'class-validator';

export class ActivityReportFilterDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  organizationId?: number;
}

export class GetActivityReportDto extends IntersectionType(
  ActivityReportFilterDto,
) {}
