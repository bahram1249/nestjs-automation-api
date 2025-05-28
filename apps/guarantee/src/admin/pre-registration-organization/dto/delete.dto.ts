import { IsOptional, IsString } from 'class-validator';

export class DeleteDto {
  @IsOptional()
  @IsString()
  rejectDescription: string;
}
