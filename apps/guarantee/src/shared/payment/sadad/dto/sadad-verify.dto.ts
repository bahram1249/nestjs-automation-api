import { IsOptional, IsString } from 'class-validator';

export class SadadVerifyDto {
  @IsString()
  OrderId: string;

  @IsString()
  Token: string;

  @IsString()
  @IsOptional()
  SwitchResCode?: string;

  @IsString()
  ResCode: string;
}
