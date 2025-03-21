import { AutoMap } from 'automapper-classes';
import { IsDateString, IsNumber } from 'class-validator';

export class GuaranteeOrganizationContractDto {
  @AutoMap()
  @IsNumber()
  public organizationId: number;

  @AutoMap()
  @IsNumber({ maxDecimalPlaces: 2 })
  public representativeShare: number;

  @AutoMap()
  @IsDateString()
  startDate: Date;

  @AutoMap()
  @IsDateString()
  endDate: Date;
}
