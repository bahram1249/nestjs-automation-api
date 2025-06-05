import { IsOptional, IsString } from 'class-validator';

export class GetNearByVendorDetailDto {
  @IsString()
  @IsOptional()
  latitude: string = '35.69980278233824';

  @IsString()
  @IsOptional()
  longitude: string = '51.33797088877799';
}
