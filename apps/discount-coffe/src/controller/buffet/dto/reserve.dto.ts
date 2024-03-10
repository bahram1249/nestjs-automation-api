import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReserveMenuDto } from './reserve-menu.dto';
import { Transform } from 'class-transformer';

export class ReserveDto {
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  buffetId: bigint;
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  personCount: number;
  @IsArray()
  @IsOptional()
  items?: ReserveMenuDto[] = [];
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  reserveType: number;
  @IsString()
  reserveDate: string;
}
