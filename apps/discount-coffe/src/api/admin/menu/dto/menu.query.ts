import { IsOptional } from 'class-validator';

export class MenuQuery {
  @IsOptional()
  buffetId?: bigint;
}
