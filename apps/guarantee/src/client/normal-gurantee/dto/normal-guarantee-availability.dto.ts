import { IsString } from 'class-validator';

export class NormalGuaranteAvailabilityeDto {
  @IsString()
  serialNumber: string;
}
