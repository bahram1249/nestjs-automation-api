import { IsArray, IsNumber, IsString } from 'class-validator';
import { ReserveMenuDto } from './reserve-menu.dto';

export class ReserveDto {
  @IsNumber()
  buffetId: bigint;
  @IsNumber()
  personCount: number;
  @IsArray()
  items?: ReserveMenuDto[];
  @IsNumber()
  reserveType: number;
  @IsString()
  reserveDate: string;
}
