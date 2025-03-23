import { IsNumber, IsString } from 'class-validator';

export class RequestStateIdDto {
  @IsNumber()
  requestStateId: bigint;

  @IsString()
  description?: string;
}
