import { IsString } from 'class-validator';

export class ZarinPalDto {
  @IsString()
  Status: string;
  @IsString()
  Authority: string;
}
