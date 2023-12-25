import { IsString } from 'class-validator';

export class CodeDto {
  @IsString()
  code: string;
}
