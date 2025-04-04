import { IsBoolean } from 'class-validator';

export class GetClientSideCartableDto {
  @IsBoolean()
  public isClientSideCartable: boolean = false;
}
