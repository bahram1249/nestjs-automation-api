import { IsString } from 'class-validator';

export class ProcessHomeByLatLonDto {
  @IsString()
  latitude: string = '35.69980278233824';

  @IsString()
  longitude: string = '51.33797088877799';
}
