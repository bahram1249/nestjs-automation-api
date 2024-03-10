import { IsArray, IsNumber } from 'class-validator';
import { ReserveMenuDto } from './reserve-menu.dto';
import { Transform } from 'class-transformer';

export class ReserveDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  reserveId: number;
  @IsArray()
  items: ReserveMenuDto[] = [];
}
