import { IsString } from 'class-validator';

export class VipGuaranteeDto {
  @IsString()
  serialNumber: string;
}
