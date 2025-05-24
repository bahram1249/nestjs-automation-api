import { IsString } from 'class-validator';

export class DeleteDto {
  @IsString()
  rejectDescription: string;
}
