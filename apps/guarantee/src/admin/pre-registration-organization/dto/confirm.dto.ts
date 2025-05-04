import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ConfirmDto {
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  public representativeShare: number;

  @IsString()
  public organizationCode: string;
}
