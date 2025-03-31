import { IsString } from 'class-validator';

export class NormalGuaranteeDto {
  @IsString()
  serialNumber: string;
}
