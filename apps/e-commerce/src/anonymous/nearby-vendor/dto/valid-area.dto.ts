import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ValidAreaDto {
  @IsOptional()
  latitude: string = '35.69980278233824';

  @IsString()
  longitude: string = '51.33797088877799';

  @IsNumber()
  vendorId: number;
}
